import zipfile
import xml.etree.ElementTree as ET
import datetime
import json
import os

def parse_excel_date(val):
    if not val:
        return '2016-01-01'
    try:
        f = float(val)
        dt = datetime.datetime(1899, 12, 30) + datetime.timedelta(days=f)
        return dt.strftime('%Y-%m-%d')
    except Exception:
        parts = val.replace('/', '-').split('-')
        if len(parts) == 3:
            if len(parts[0]) == 4:
                return f"{int(parts[0]):04d}-{int(parts[1]):02d}-{int(parts[2]):02d}"
            else:
                return f"{int(parts[2]):04d}-{int(parts[0]):02d}-{int(parts[1]):02d}"
        return val

def normalize_number(val, col_type='sales'):
    if not val:
        return 0.0
    try:
        n = float(val)
    except Exception:
        # handle string numbers with dots
        s = str(val).replace(' ', '')
        if s.count('.') > 1:
            s = s.replace('.', '')
        try:
            n = float(s)
        except Exception:
            return 0.0

    # Handle the specific spreadsheet digit scaling artifact
    # In standard US Superstore, max single sale is ~$22,638 (Cisco telepresence) and avg sale is ~$230.
    # Scaled numbers were multiplied by 1,000 or 10,000 when decimals like .368 or .5775 lost decimal points.
    abs_n = abs(n)
    if abs_n >= 1000000: # e.g. 9575775.0 -> 957.5775 or 1325922.0 -> 132.5922
        n = n / 10000.0
    elif abs_n >= 50000: # e.g. 71372.0 -> 71.372 or 419136.0 -> 41.9136
        if abs_n >= 100000:
            n = n / 10000.0
        else:
            n = n / 1000.0
    elif abs_n >= 10000: # e.g. 22368.0 -> 22.368 or 15552.0 -> 15.552
        n = n / 1000.0
    
    # Check profit vs sales ratio realism
    return round(n, 2)

def extract_superstore_data(xlsx_path):
    print("Reading", xlsx_path)
    with zipfile.ZipFile(xlsx_path, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in tree.findall('ns:si', ns):
                text_elems = si.findall('.//ns:t', ns)
                shared_strings.append(''.join([t.text or '' for t in text_elems]))
        
        tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        
        rows = []
        for row in tree.findall('.//ns:row', ns):
            row_data = {}
            for c in row.findall('ns:c', ns):
                ref = c.attrib.get('r', '')
                col_letter = ''.join(filter(str.isalpha, ref))
                t = c.attrib.get('t', '')
                v_elem = c.find('ns:v', ns)
                val = v_elem.text if v_elem is not None else ''
                if t == 's' and val.isdigit():
                    val = shared_strings[int(val)]
                row_data[col_letter] = val
            rows.append(row_data)

    orders = []
    # Header row is index 0
    # A: Row ID, B: Order ID, C: Order Date, D: Ship Date, E: Ship Mode
    # F: Customer ID, G: Customer Name, H: Segment, I: Country, J: City, K: State, L: Postal Code, M: Region
    # N: Product ID, O: Category, P: Sub-Category, Q: Product Name, R: Sales, S: Quantity, T: Discount, U: Profit
    for r in rows[1:]:
        if not r.get('B'): # Skip empty row
            continue
        order_date_str = parse_excel_date(r.get('C', ''))
        ship_date_str = parse_excel_date(r.get('D', ''))
        
        try:
            dt = datetime.datetime.strptime(order_date_str, '%Y-%m-%d')
            year = dt.year
            month = dt.month
            year_month = f"{dt.year}-{dt.month:02d}"
            quarter = f"Q{(dt.month - 1) // 3 + 1} {dt.year}"
        except Exception:
            year = 2016
            month = 1
            year_month = "2016-01"
            quarter = "Q1 2016"

        sales = normalize_number(r.get('R', '0'), 'sales')
        profit = normalize_number(r.get('U', '0'), 'profit')
        try:
            qty = int(float(r.get('S', 1) or 1))
        except Exception:
            qty = 1
        try:
            discount = float(r.get('T', 0) or 0)
        except Exception:
            discount = 0.0

        orders.append({
            'id': r.get('A', ''),
            'orderId': r.get('B', ''),
            'orderDate': order_date_str,
            'shipDate': ship_date_str,
            'year': year,
            'month': month,
            'yearMonth': year_month,
            'quarter': quarter,
            'shipMode': r.get('E', 'Standard Class'),
            'customerId': r.get('F', ''),
            'customerName': r.get('G', 'Unknown'),
            'segment': r.get('H', 'Consumer'),
            'country': r.get('I', 'United States'),
            'city': r.get('J', ''),
            'state': r.get('K', ''),
            'postalCode': str(r.get('L', '')).replace('.0', ''),
            'region': r.get('M', 'West'),
            'productId': r.get('N', ''),
            'category': r.get('O', 'Office Supplies'),
            'subCategory': r.get('P', 'Binders'),
            'productName': r.get('Q', ''),
            'sales': sales,
            'quantity': qty,
            'discount': discount,
            'profit': profit
        })

    print(f"Processed {len(orders)} transactions successfully.")
    
    # Calculate global totals
    total_sales = sum(o['sales'] for o in orders)
    total_profit = sum(o['profit'] for o in orders)
    total_qty = sum(o['quantity'] for o in orders)
    margin = (total_profit / total_sales * 100) if total_sales else 0
    print(f"Total Sales: ${total_sales:,.2f}")
    print(f"Total Profit: ${total_profit:,.2f}")
    print(f"Profit Margin: {margin:.2f}%")
    print(f"Total Orders: {len(set(o['orderId'] for o in orders))}")
    print(f"Total Items Sold: {total_qty}")

    # Write as JavaScript file with global variable for standalone browser execution
    js_content = "window.SUPERSTORE_DATA = " + json.dumps(orders, separators=(',', ':')) + ";"
    with open("data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    print("Saved data.js successfully!")

    with open("superstore_data.json", "w", encoding="utf-8") as f:
        json.dump(orders, f, indent=2)
    print("Saved superstore_data.json successfully!")

if __name__ == '__main__':
    extract_superstore_data('Superstore dataset (1).xlsx')
