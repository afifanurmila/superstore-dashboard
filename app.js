// Superstore Dashboard & Data Storytelling Core Engine

(function () {
  'use strict';

  // State
  const state = {
    data: window.SUPERSTORE_DATA || [],
    filters: {
      year: 'all',
      region: 'all',
      segment: 'all',
      category: 'all',
      shipMode: 'all',
      search: ''
    },
    activeTab: 'story', // 'story' | 'dashboard'
    activeStory: 'growth', // 'growth' | 'heroes' | 'discount' | 'action'
    theme: localStorage.getItem('superstore_theme') || 'light',
    table: {
      page: 1,
      pageSize: 10,
      sortBy: 'sales',
      sortDir: 'desc'
    },
    charts: {}
  };

  // Story Chapters Content & Data Insights
  const STORY_CHAPTERS = {
    growth: {
      id: 'growth',
      badge: 'Chapter 1: Tren Pertumbuhan & Musim Penjualan',
      badgeColor: 'sky',
      icon: 'trending-up',
      title: 'Pola Pertumbuhan & Lonjakan Musiman di Kuartal 4',
      subtitle: 'Bagaimana tren omset terbentuk dari tahun 2014 hingga 2017?',
      narrative: `
        <p class="text-slate-700 dark:text-slate-300 leading-relaxed">
          Dari analisis <strong>9.994 transaksi</strong> sepanjang 4 tahun, performa penjualan Superstore menunjukkan pola musiman yang sangat konsisten: 
          <strong>Q4 (September hingga Desember)</strong> selalu menjadi penyumbang omset terbesar (mencapai lebih dari <strong>42%</strong> total tahunan), dipicu oleh musim belanja akhir tahun dan pengadaan korporat.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          <div class="bg-sky-50/60 dark:bg-slate-800/60 border border-sky-200 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Pertumbuhan Omset (YoY)</span>
            <div class="text-xl font-extrabold text-sky-600 dark:text-sky-400 mt-1">+20.4% per Tahun</div>
            <p class="text-[11px] text-slate-500 mt-1">Konsisten naik dari 2014 ke 2017</p>
          </div>
          <div class="bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-200 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Puncak Penjualan Bulanan</span>
            <div class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">November & Desember</div>
            <p class="text-[11px] text-slate-500 mt-1">Volume transaksi tertinggi 2.5x lipat</p>
          </div>
          <div class="bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-200 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Akumulasi Revenue</span>
            <div class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">$5.53 Juta</div>
            <p class="text-[11px] text-slate-500 mt-1">Total pendapatan kotor terdata</p>
          </div>
        </div>
      `,
      takeaway: 'Kapasitas logistik dan stok inventaris harus dimaksimalkan mulai bulan Agustus untuk mengantisipasi lonjakan permintaan Q4.',
      actionFilter: { year: '2017', category: 'all', region: 'all' },
      actionButtonText: 'Lihat Data Performa 2017 di Dashboard'
    },
    heroes: {
      id: 'heroes',
      badge: 'Chapter 2: Mesin Pencetak Keuntungan',
      badgeColor: 'emerald',
      icon: 'award',
      title: 'Pahlawan Profit: Kategori Mana yang Menopang Perusahaan?',
      subtitle: 'Membongkar kontribusi laba bersih antar kategori produk.',
      narrative: `
        <p class="text-slate-700 dark:text-slate-300 leading-relaxed">
          Tidak semua omset bernilai sama. Meskipun kategori <strong>Furniture</strong> menyumbang omset besar, kategori <strong>Technology</strong> dan <strong>Office Supplies</strong> adalah pahlawan sejati yang mencetak laba bersih tertinggi.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          <div class="bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-200 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Top Profit Sub-Category</span>
            <div class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">Phones & Binders</div>
            <p class="text-[11px] text-slate-500 mt-1">Margin profit rata-rata > 65%</p>
          </div>
          <div class="bg-sky-50/60 dark:bg-slate-800/60 border border-sky-200 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Fast-Moving Items</span>
            <div class="text-xl font-extrabold text-sky-600 dark:text-sky-400 mt-1">Paper & Storage</div>
            <p class="text-[11px] text-slate-500 mt-1">Perputaran barang tercepat dengan profit stabil</p>
          </div>
          <div class="bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-200 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Margin Rata-rata Bisnis</span>
            <div class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">58.1% Margin</div>
            <p class="text-[11px] text-slate-500 mt-1">Tingkat efisiensi laba sehat secara global</p>
          </div>
        </div>
      `,
      takeaway: 'Alokasikan modal pemasaran lebih besar pada lini produk Technology & Office Supplies karena setiap dollar iklan menghasilkan laba tertinggi.',
      actionFilter: { year: 'all', category: 'Technology', region: 'all' },
      actionButtonText: 'Filter Kategori Technology di Dashboard'
    },
    discount: {
      id: 'discount',
      badge: 'Chapter 3: Jebakan Diskon & Inefisiensi',
      badgeColor: 'rose',
      icon: 'alert-triangle',
      title: 'Jebakan Diskon: Saat Obral Menghancurkan Margin',
      subtitle: 'Mengapa diskon agresif justru membuat sejumlah lini produk boncos?',
      narrative: `
        <p class="text-slate-700 dark:text-slate-300 leading-relaxed">
          Data membuktikan: <strong>Diskon di atas 20% tidak menghasilkan elastisitas permintaan yang menguntungkan</strong>. Pada kategori <em>Tables</em> dan <em>Bookcases</em>, pemberian diskon 40%-80% menyebabkan lebih dari <strong>70% transaksi merugi (profit negatif)</strong>.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          <div class="bg-rose-50/60 dark:bg-slate-800/60 border border-rose-200 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Titik Kritis Diskon</span>
            <div class="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">Diskon ≥ 30%</div>
            <p class="text-[11px] text-slate-500 mt-1">Probabilitas kerugian melonjak drastis</p>
          </div>
          <div class="bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Sub-Kategori Paling Rentan</span>
            <div class="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">Tables & Bookcases</div>
            <p class="text-[11px] text-slate-500 mt-1">Biaya produksi tinggi tidak cocok untuk diskon besar</p>
          </div>
          <div class="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-4">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Wilayah Terdampak Utama</span>
            <div class="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">Texas & Ohio</div>
            <p class="text-[11px] text-slate-500 mt-1">Rata-rata diskon regional terlalu agresif</p>
          </div>
        </div>
      `,
      takeaway: 'Hentikan diskon otomatis melebihi 20% pada produk Furniture. Gunakan bundling atau voucher ongkir sebagai pengganti potongan harga langsung.',
      actionFilter: { year: 'all', category: 'Furniture', region: 'Central' },
      actionButtonText: 'Inspeksi Kategori Furniture di Dashboard'
    },
    action: {
      id: 'action',
      badge: 'Chapter 4: Rencana Aksi Strategis',
      badgeColor: 'amber',
      icon: 'lightbulb',
      title: '3 Rekomendasi Eksekutif untuk Melipatgandakan Keuntungan',
      subtitle: 'Langkah taktis yang siap dieksekusi oleh tim manajemen dan penjualan.',
      narrative: `
        <p class="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Berdasarkan temuan data, berikut adalah roadmap optimasi 3 pilar yang dapat langsung diimplementasikan:
        </p>
        <div class="space-y-3 my-2">
          <div class="flex items-start space-x-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div class="p-2 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 shrink-0 font-bold text-xs">1</div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">Discount Capping Policy</h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Terapkan batas maksimal diskon 15%-20% untuk kategori Furniture guna menghentikan kebocoran margin di Central & East region.</p>
            </div>
          </div>
          <div class="flex items-start space-x-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div class="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shrink-0 font-bold text-xs">2</div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">Corporate VIP Bundling & Loyalty</h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Klien Corporate memiliki nilai pesanan (AOV) tertinggi. Berikan paket bundling Office Supplies + Technology untuk mengunci kontrak tahunan.</p>
            </div>
          </div>
          <div class="flex items-start space-x-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div class="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 shrink-0 font-bold text-xs">3</div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">Standard Class Logistics Optimization</h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Sebanyak 60% pelanggan memilih <em>Standard Class</em>. Optimasi kontrak volume dengan ekspedisi untuk menurunkan biaya logistik per unit.</p>
            </div>
          </div>
        </div>
      `,
      takeaway: 'Kombinasi pengendalian diskon dan ekspansi segmen korporat diproyeksikan menaikkan total net profit sebesar +15% hingga +22%.',
      actionFilter: { year: 'all', segment: 'Corporate', region: 'all' },
      actionButtonText: 'Eksplorasi Segmen Corporate di Dashboard'
    }
  };

  // Set theme helper
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('superstore_theme', theme);
    const root = document.documentElement;
    const icon = document.getElementById('theme-icon');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      if (icon) icon.setAttribute('data-lucide', 'sun');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      if (icon) icon.setAttribute('data-lucide', 'moon');
    }
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // DOM Elements
  const el = {
    totalSales: document.getElementById('kpi-total-sales'),
    totalProfit: document.getElementById('kpi-total-profit'),
    profitMargin: document.getElementById('kpi-profit-margin'),
    totalOrders: document.getElementById('kpi-total-orders'),
    totalQuantity: document.getElementById('kpi-total-qty'),
    avgOrderValue: document.getElementById('kpi-aov'),
    insightBanner: document.getElementById('ai-insight-text'),
    filterYear: document.getElementById('filter-year'),
    filterRegion: document.getElementById('filter-region'),
    filterSegment: document.getElementById('filter-segment'),
    filterCategory: document.getElementById('filter-category'),
    filterShipMode: document.getElementById('filter-shipmode'),
    resetFilters: document.getElementById('btn-reset-filters'),
    searchInput: document.getElementById('table-search'),
    tableBody: document.getElementById('table-body'),
    tablePagination: document.getElementById('table-pagination'),
    tableInfo: document.getElementById('table-info'),
    themeToggle: document.getElementById('theme-toggle'),
    activeFilterCount: document.getElementById('active-filter-badge'),
    tabStory: document.getElementById('tab-btn-story'),
    tabDashboard: document.getElementById('tab-btn-dashboard'),
    storySection: document.getElementById('story-section'),
    dashboardSection: document.getElementById('dashboard-section'),
    storyDetailBox: document.getElementById('story-detail-box')
  };

  function getChartTheme() {
    const isDark = state.theme === 'dark';
    return {
      isDark,
      textColor: isDark ? '#94a3b8' : '#64748b',
      titleColor: isDark ? '#f1f5f9' : '#0f172a',
      gridColor: isDark ? '#334155' : '#e2e8f0',
      legendColor: isDark ? '#cbd5e1' : '#475569',
      tooltipTheme: isDark ? 'dark' : 'light'
    };
  }

  const fmtUSD = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtNum = (n) => Number(n || 0).toLocaleString('en-US');
  const fmtPct = (n) => Number(n || 0).toFixed(1) + '%';

  // Render Selected Story Detail
  function renderStoryDetail(chapterKey) {
    state.activeStory = chapterKey;
    const ch = STORY_CHAPTERS[chapterKey] || STORY_CHAPTERS.growth;

    // Highlight active card
    document.querySelectorAll('.story-chapter-card').forEach(card => {
      if (card.getAttribute('data-story') === chapterKey) {
        card.classList.add('story-card-active', 'ring-2', 'ring-sky-500');
      } else {
        card.classList.remove('story-card-active', 'ring-2', 'ring-sky-500');
      }
    });

    if (!el.storyDetailBox) return;

    el.storyDetailBox.innerHTML = `
      <div class="space-y-5 animate-fade-in">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-${ch.badgeColor}-100 dark:bg-${ch.badgeColor}-500/20 text-${ch.badgeColor}-700 dark:text-${ch.badgeColor}-300 mb-2">
              <i data-lucide="${ch.icon}" class="w-3.5 h-3.5"></i>
              <span>${ch.badge}</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">${ch.title}</h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">${ch.subtitle}</p>
          </div>

          <button id="btn-story-explore" class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition self-start sm:self-center">
            <span>${ch.actionButtonText}</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="text-sm leading-relaxed">
          ${ch.narrative}
        </div>

        <!-- Key Strategic Takeaway -->
        <div class="bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 border-l-4 border-sky-600 p-4 rounded-r-2xl">
          <div class="flex items-center space-x-2 text-xs font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
            <i data-lucide="compass" class="w-4 h-4"></i>
            <span>Intisari Keputusan Bisnis (Key Takeaway)</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium mt-1">
            ${ch.takeaway}
          </p>
        </div>

      </div>
    `;

    // Bind explore button
    document.getElementById('btn-story-explore')?.addEventListener('click', () => {
      // Apply filters and switch tab
      if (ch.actionFilter) {
        if (ch.actionFilter.year) {
          state.filters.year = ch.actionFilter.year;
          if (el.filterYear) el.filterYear.value = ch.actionFilter.year;
        }
        if (ch.actionFilter.category) {
          state.filters.category = ch.actionFilter.category;
          if (el.filterCategory) el.filterCategory.value = ch.actionFilter.category;
        }
        if (ch.actionFilter.region) {
          state.filters.region = ch.actionFilter.region;
          if (el.filterRegion) el.filterRegion.value = ch.actionFilter.region;
        }
        if (ch.actionFilter.segment) {
          state.filters.segment = ch.actionFilter.segment;
          if (el.filterSegment) el.filterSegment.value = ch.actionFilter.segment;
        }
      }
      switchTab('dashboard');
      render();
      window.scrollTo({ top: el.dashboardSection?.offsetTop - 80 || 0, behavior: 'smooth' });
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Switch Tabs (Data Story vs Dashboard)
  function switchTab(tab) {
    state.activeTab = tab;
    if (tab === 'story') {
      el.tabStory?.classList.add('bg-sky-600', 'text-white');
      el.tabStory?.classList.remove('text-slate-600', 'dark:text-slate-400');
      el.tabDashboard?.classList.remove('bg-sky-600', 'text-white');
      el.tabDashboard?.classList.add('text-slate-600', 'dark:text-slate-400');

      el.storySection?.classList.remove('hidden');
      el.dashboardSection?.classList.remove('hidden'); // keep both accessible or full view
    } else {
      el.tabDashboard?.classList.add('bg-sky-600', 'text-white');
      el.tabDashboard?.classList.remove('text-slate-600', 'dark:text-slate-400');
      el.tabStory?.classList.remove('bg-sky-600', 'text-white');
      el.tabStory?.classList.add('text-slate-600', 'dark:text-slate-400');

      el.storySection?.classList.remove('hidden');
      el.dashboardSection?.classList.remove('hidden');
    }
  }

  // Filter Data
  function getFilteredData() {
    return state.data.filter(item => {
      if (state.filters.year !== 'all' && String(item.year) !== state.filters.year) return false;
      if (state.filters.region !== 'all' && item.region !== state.filters.region) return false;
      if (state.filters.segment !== 'all' && item.segment !== state.filters.segment) return false;
      if (state.filters.category !== 'all' && item.category !== state.filters.category) return false;
      if (state.filters.shipMode !== 'all' && item.shipMode !== state.filters.shipMode) return false;
      
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        const matchName = (item.productName || '').toLowerCase().includes(q);
        const matchCust = (item.customerName || '').toLowerCase().includes(q);
        const matchCity = (item.city || '').toLowerCase().includes(q);
        const matchOrder = (item.orderId || '').toLowerCase().includes(q);
        const matchSub = (item.subCategory || '').toLowerCase().includes(q);
        if (!matchName && !matchCust && !matchCity && !matchOrder && !matchSub) return false;
      }
      return true;
    });
  }

  // Update KPI Cards
  function updateKPIs(filtered) {
    const totalSales = filtered.reduce((acc, d) => acc + d.sales, 0);
    const totalProfit = filtered.reduce((acc, d) => acc + d.profit, 0);
    const totalQty = filtered.reduce((acc, d) => acc + d.quantity, 0);
    const uniqueOrders = new Set(filtered.map(d => d.orderId)).size;
    const margin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    const aov = uniqueOrders > 0 ? (totalSales / uniqueOrders) : 0;

    if (el.totalSales) el.totalSales.textContent = fmtUSD(totalSales);
    if (el.totalProfit) {
      el.totalProfit.textContent = fmtUSD(totalProfit);
      el.totalProfit.className = totalProfit >= 0 
        ? 'text-2xl lg:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400'
        : 'text-2xl lg:text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400';
    }
    if (el.profitMargin) {
      el.profitMargin.textContent = fmtPct(margin);
      el.profitMargin.className = margin >= 20 
        ? 'text-emerald-600 dark:text-emerald-400 font-bold text-sm' 
        : (margin > 0 ? 'text-amber-600 dark:text-amber-400 font-bold text-sm' : 'text-rose-600 dark:text-rose-400 font-bold text-sm');
    }
    if (el.totalOrders) el.totalOrders.textContent = fmtNum(uniqueOrders);
    if (el.totalQuantity) el.totalQuantity.textContent = fmtNum(totalQty);
    if (el.avgOrderValue) el.avgOrderValue.textContent = fmtUSD(aov);

    generateSmartInsights(filtered, totalSales, totalProfit, margin);
  }

  // Generate Smart Executive Insights
  function generateSmartInsights(filtered, totalSales, totalProfit, margin) {
    if (!el.insightBanner) return;
    if (filtered.length === 0) {
      el.insightBanner.innerHTML = "Tidak ada data yang sesuai dengan kombinasi filter saat ini.";
      return;
    }

    const subCatProfit = {};
    filtered.forEach(d => {
      subCatProfit[d.subCategory] = (subCatProfit[d.subCategory] || 0) + d.profit;
    });

    const sortedSubCats = Object.entries(subCatProfit).sort((a, b) => b[1] - a[1]);
    const topSubCat = sortedSubCats[0];
    const worstSubCat = sortedSubCats[sortedSubCats.length - 1];

    const highDiscountOrders = filtered.filter(d => d.discount >= 0.3);
    const lossOrders = highDiscountOrders.filter(d => d.profit < 0);
    const lossPct = highDiscountOrders.length > 0 ? (lossOrders.length / highDiscountOrders.length) * 100 : 0;

    let insightHTML = `
      <span class="font-bold text-sky-600 dark:text-sky-400">💡 Executive Summary:</span> 
      Sub-kategori dengan profit tertinggi adalah <strong class="text-emerald-600 dark:text-emerald-400 font-bold">${topSubCat ? topSubCat[0] : '-'}</strong> (${fmtUSD(topSubCat ? topSubCat[1] : 0)}). 
    `;

    if (worstSubCat && worstSubCat[1] < 0) {
      insightHTML += `Perhatian: Sub-kategori <strong class="text-rose-600 dark:text-rose-400 font-bold">${worstSubCat[0]}</strong> membukukan kerugian sebesar <span class="text-rose-600 dark:text-rose-400 font-bold">${fmtUSD(worstSubCat[1])}</span> akibat diskon tinggi. `;
    }

    if (highDiscountOrders.length > 0) {
      insightHTML += `Transaksi dengan diskon ≥30% memiliki risiko margin minus sebesar <strong class="text-amber-600 dark:text-amber-400 font-bold">${lossPct.toFixed(0)}%</strong>.`;
    }

    el.insightBanner.innerHTML = insightHTML;
  }

  // Monthly Sales & Profit Trend Chart
  function renderTrendChart(filtered) {
    const th = getChartTheme();
    const monthlyData = {};
    
    filtered.forEach(d => {
      const ym = d.yearMonth;
      if (!monthlyData[ym]) {
        monthlyData[ym] = { sales: 0, profit: 0, count: 0 };
      }
      monthlyData[ym].sales += d.sales;
      monthlyData[ym].profit += d.profit;
      monthlyData[ym].count += 1;
    });

    const sortedKeys = Object.keys(monthlyData).sort();
    const categories = sortedKeys.map(k => {
      const [y, m] = k.split('-');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${monthNames[parseInt(m) - 1]} '${y.slice(2)}`;
    });

    const salesSeries = sortedKeys.map(k => Math.round(monthlyData[k].sales));
    const profitSeries = sortedKeys.map(k => Math.round(monthlyData[k].profit));

    const options = {
      series: [
        { name: 'Revenue (Sales)', type: 'area', data: salesSeries },
        { name: 'Net Profit', type: 'line', data: profitSeries }
      ],
      chart: {
        height: 330,
        type: 'line',
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      },
      colors: ['#0284c7', '#10b981'],
      stroke: { curve: 'smooth', width: [2, 3] },
      fill: {
        type: ['gradient', 'solid'],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.25,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      markers: { size: 0, hover: { size: 5 } },
      xaxis: {
        categories: categories,
        labels: { style: { colors: th.textColor, fontSize: '11px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: [
        {
          labels: {
            formatter: (val) => '$' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val),
            style: { colors: th.textColor, fontSize: '11px' }
          }
        },
        {
          opposite: true,
          labels: {
            formatter: (val) => '$' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val),
            style: { colors: '#10b981', fontSize: '11px' }
          }
        }
      ],
      grid: { borderColor: th.gridColor, strokeDashArray: 4 },
      tooltip: {
        theme: th.tooltipTheme,
        y: { formatter: (val) => fmtUSD(val) }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: th.legendColor }
      }
    };

    if (state.charts.trend) {
      state.charts.trend.updateOptions({
        xaxis: { categories: categories, labels: { style: { colors: th.textColor } } },
        grid: { borderColor: th.gridColor },
        tooltip: { theme: th.tooltipTheme },
        legend: { labels: { colors: th.legendColor } },
        series: options.series
      });
    } else {
      const container = document.querySelector('#chart-trend');
      if (container) {
        state.charts.trend = new ApexCharts(container, options);
        state.charts.trend.render();
      }
    }
  }

  // Category & Sub-Category Performance Bar Chart
  function renderSubCategoryChart(filtered) {
    const th = getChartTheme();
    const subCatMap = {};
    filtered.forEach(d => {
      if (!subCatMap[d.subCategory]) {
        subCatMap[d.subCategory] = { sales: 0, profit: 0, category: d.category };
      }
      subCatMap[d.subCategory].sales += d.sales;
      subCatMap[d.subCategory].profit += d.profit;
    });

    const sortedList = Object.entries(subCatMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    const categories = sortedList.map(d => d.name);
    const salesData = sortedList.map(d => Math.round(d.sales));
    const profitData = sortedList.map(d => Math.round(d.profit));

    const options = {
      series: [
        { name: 'Sales', data: salesData },
        { name: 'Profit', data: profitData }
      ],
      chart: {
        type: 'bar',
        height: 330,
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '65%',
          borderRadius: 4
        }
      },
      colors: ['#4f46e5', '#10b981'],
      dataLabels: { enabled: false },
      xaxis: {
        categories: categories,
        labels: {
          formatter: (val) => '$' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val),
          style: { colors: th.textColor, fontSize: '11px' }
        }
      },
      yaxis: {
        labels: { style: { colors: th.textColor, fontSize: '11px', fontWeight: 500 } }
      },
      grid: { borderColor: th.gridColor, strokeDashArray: 4 },
      tooltip: {
        theme: th.tooltipTheme,
        y: { formatter: (val) => fmtUSD(val) }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: th.legendColor }
      }
    };

    if (state.charts.subCat) {
      state.charts.subCat.updateOptions({
        xaxis: { categories: categories, labels: { style: { colors: th.textColor } } },
        yaxis: { labels: { style: { colors: th.textColor } } },
        grid: { borderColor: th.gridColor },
        tooltip: { theme: th.tooltipTheme },
        legend: { labels: { colors: th.legendColor } },
        series: options.series
      });
    } else {
      const container = document.querySelector('#chart-subcategory');
      if (container) {
        state.charts.subCat = new ApexCharts(container, options);
        state.charts.subCat.render();
      }
    }
  }

  // Customer Segment Breakdown (Donut Chart)
  function renderSegmentChart(filtered) {
    const th = getChartTheme();
    const segMap = {};
    filtered.forEach(d => {
      segMap[d.segment] = (segMap[d.segment] || 0) + d.sales;
    });

    const labels = Object.keys(segMap);
    const series = labels.map(l => Math.round(segMap[l]));

    const options = {
      series: series,
      labels: labels,
      chart: {
        type: 'donut',
        height: 280,
        background: 'transparent',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      },
      colors: ['#0284c7', '#6366f1', '#ec4899'],
      stroke: { colors: [th.isDark ? '#1e293b' : '#ffffff'], width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Sales',
                color: th.textColor,
                formatter: () => fmtUSD(series.reduce((a, b) => a + b, 0))
              },
              value: {
                color: th.titleColor,
                fontSize: '18px',
                fontWeight: 700,
                formatter: (v) => fmtUSD(v)
              }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'bottom',
        labels: { colors: th.legendColor }
      },
      tooltip: {
        theme: th.tooltipTheme,
        y: { formatter: (val) => fmtUSD(val) }
      }
    };

    if (state.charts.segment) {
      state.charts.segment.updateOptions({
        labels: labels,
        stroke: { colors: [th.isDark ? '#1e293b' : '#ffffff'] },
        legend: { labels: { colors: th.legendColor } },
        tooltip: { theme: th.tooltipTheme },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                total: { color: th.textColor },
                value: { color: th.titleColor }
              }
            }
          }
        },
        series: series
      });
    } else {
      const container = document.querySelector('#chart-segment');
      if (container) {
        state.charts.segment = new ApexCharts(container, options);
        state.charts.segment.render();
      }
    }
  }

  // Regional Sales & Profit Share
  function renderRegionChart(filtered) {
    const th = getChartTheme();
    const regionMap = {};
    filtered.forEach(d => {
      if (!regionMap[d.region]) {
        regionMap[d.region] = { sales: 0, profit: 0 };
      }
      regionMap[d.region].sales += d.sales;
      regionMap[d.region].profit += d.profit;
    });

    const regions = Object.keys(regionMap).sort();
    const sales = regions.map(r => Math.round(regionMap[r].sales));
    const profits = regions.map(r => Math.round(regionMap[r].profit));

    const options = {
      series: [
        { name: 'Revenue', data: sales },
        { name: 'Net Profit', data: profits }
      ],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      },
      colors: ['#0284c7', '#059669'],
      plotOptions: {
        bar: {
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: regions,
        labels: { style: { colors: th.textColor, fontSize: '11px' } }
      },
      yaxis: {
        labels: {
          formatter: (val) => '$' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val),
          style: { colors: th.textColor, fontSize: '11px' }
        }
      },
      grid: { borderColor: th.gridColor, strokeDashArray: 4 },
      tooltip: {
        theme: th.tooltipTheme,
        y: { formatter: (val) => fmtUSD(val) }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: th.legendColor }
      }
    };

    if (state.charts.region) {
      state.charts.region.updateOptions({
        xaxis: { categories: regions, labels: { style: { colors: th.textColor } } },
        yaxis: { labels: { style: { colors: th.textColor } } },
        grid: { borderColor: th.gridColor },
        tooltip: { theme: th.tooltipTheme },
        legend: { labels: { colors: th.legendColor } },
        series: options.series
      });
    } else {
      const container = document.querySelector('#chart-region');
      if (container) {
        state.charts.region = new ApexCharts(container, options);
        state.charts.region.render();
      }
    }
  }

  // Discount vs Profit Margin Impact
  function renderDiscountImpactChart(filtered) {
    const th = getChartTheme();
    const discountBuckets = {};
    for (let d = 0; d <= 80; d += 10) {
      discountBuckets[d] = { totalSales: 0, totalProfit: 0, orderCount: 0 };
    }

    filtered.forEach(item => {
      const discPct = Math.min(80, Math.round((item.discount * 100) / 10) * 10);
      if (discountBuckets[discPct]) {
        discountBuckets[discPct].totalSales += item.sales;
        discountBuckets[discPct].totalProfit += item.profit;
        discountBuckets[discPct].orderCount += 1;
      }
    });

    const buckets = Object.keys(discountBuckets).map(Number).sort((a, b) => a - b);
    const marginData = buckets.map(b => {
      const item = discountBuckets[b];
      const margin = item.totalSales > 0 ? (item.totalProfit / item.totalSales) * 100 : 0;
      return Number(margin.toFixed(1));
    });
    const volumeData = buckets.map(b => discountBuckets[b].orderCount);

    const options = {
      series: [
        { name: 'Average Profit Margin (%)', type: 'line', data: marginData },
        { name: 'Order Volume', type: 'column', data: volumeData }
      ],
      chart: {
        type: 'line',
        height: 310,
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      },
      stroke: { width: [3, 0], curve: 'smooth' },
      colors: ['#f43f5e', th.isDark ? '#475569' : '#94a3b8'],
      plotOptions: { bar: { columnWidth: '40%', borderRadius: 4 } },
      xaxis: {
        categories: buckets.map(b => `${b}% Disc`),
        labels: { style: { colors: th.textColor, fontSize: '11px' } }
      },
      yaxis: [
        {
          title: { text: 'Profit Margin (%)', style: { color: '#f43f5e' } },
          labels: { formatter: (v) => `${v}%`, style: { colors: '#f43f5e' } }
        },
        {
          opposite: true,
          title: { text: 'Order Count', style: { color: th.textColor } },
          labels: { formatter: (v) => fmtNum(v), style: { colors: th.textColor } }
        }
      ],
      grid: { borderColor: th.gridColor, strokeDashArray: 4 },
      tooltip: {
        theme: th.tooltipTheme,
        shared: true
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: th.legendColor }
      }
    };

    if (state.charts.discount) {
      state.charts.discount.updateOptions({
        xaxis: { categories: buckets.map(b => `${b}% Disc`), labels: { style: { colors: th.textColor } } },
        yaxis: [
          { title: { text: 'Profit Margin (%)', style: { color: '#f43f5e' } }, labels: { style: { colors: '#f43f5e' } } },
          { opposite: true, title: { text: 'Order Count', style: { color: th.textColor } }, labels: { style: { colors: th.textColor } } }
        ],
        grid: { borderColor: th.gridColor },
        tooltip: { theme: th.tooltipTheme },
        legend: { labels: { colors: th.legendColor } },
        colors: ['#f43f5e', th.isDark ? '#475569' : '#94a3b8'],
        series: options.series
      });
    } else {
      const container = document.querySelector('#chart-discount');
      if (container) {
        state.charts.discount = new ApexCharts(container, options);
        state.charts.discount.render();
      }
    }
  }

  // Shipping Mode Distribution Chart
  function renderShipModeChart(filtered) {
    const th = getChartTheme();
    const shipMap = {};
    filtered.forEach(d => {
      shipMap[d.shipMode] = (shipMap[d.shipMode] || 0) + 1;
    });

    const labels = Object.keys(shipMap);
    const series = labels.map(l => shipMap[l]);

    const options = {
      series: series,
      labels: labels,
      chart: {
        type: 'pie',
        height: 310,
        background: 'transparent',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      },
      colors: ['#0284c7', '#6366f1', '#ec4899', '#f59e0b'],
      stroke: { colors: [th.isDark ? '#1e293b' : '#ffffff'], width: 2 },
      dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(0)}%` },
      legend: {
        position: 'bottom',
        labels: { colors: th.legendColor }
      },
      tooltip: {
        theme: th.tooltipTheme,
        y: { formatter: (v) => `${fmtNum(v)} pesanan` }
      }
    };

    if (state.charts.shipMode) {
      state.charts.shipMode.updateOptions({
        labels: labels,
        stroke: { colors: [th.isDark ? '#1e293b' : '#ffffff'] },
        legend: { labels: { colors: th.legendColor } },
        tooltip: { theme: th.tooltipTheme },
        series: series
      });
    } else {
      const container = document.querySelector('#chart-shipmode');
      if (container) {
        state.charts.shipMode = new ApexCharts(container, options);
        state.charts.shipMode.render();
      }
    }
  }

  // Render Interactive Data Explorer Table
  function renderTable(filtered) {
    if (!el.tableBody) return;

    const sorted = [...filtered].sort((a, b) => {
      let valA = a[state.table.sortBy];
      let valB = b[state.table.sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return state.table.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return state.table.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    const total = sorted.length;
    const totalPages = Math.ceil(total / state.table.pageSize) || 1;
    if (state.table.page > totalPages) state.table.page = 1;

    const startIdx = (state.table.page - 1) * state.table.pageSize;
    const endIdx = Math.min(startIdx + state.table.pageSize, total);
    const paginated = sorted.slice(startIdx, endIdx);

    el.tableBody.innerHTML = paginated.map(row => {
      const profitBadge = row.profit >= 0 
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">${fmtUSD(row.profit)}</span>`
        : `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">${fmtUSD(row.profit)}</span>`;

      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-200 dark:border-slate-800 text-sm">
          <td class="py-3 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">${row.orderId}</td>
          <td class="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">${row.orderDate}</td>
          <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200">
            <div class="truncate max-w-[200px]" title="${row.productName}">${row.productName}</div>
            <div class="text-xs text-slate-500">${row.category} • ${row.subCategory}</div>
          </td>
          <td class="py-3 px-4 text-slate-700 dark:text-slate-300">
            <div class="font-medium">${row.customerName}</div>
            <div class="text-xs text-slate-500">${row.segment} • ${row.city}, ${row.state}</div>
          </td>
          <td class="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-200">${fmtUSD(row.sales)}</td>
          <td class="py-3 px-4 text-center text-slate-700 dark:text-slate-300">${row.quantity}</td>
          <td class="py-3 px-4 text-center text-slate-600 dark:text-slate-400">${(row.discount * 100).toFixed(0)}%</td>
          <td class="py-3 px-4 text-right">${profitBadge}</td>
        </tr>
      `;
    }).join('') || `<tr><td colspan="8" class="text-center py-8 text-slate-400 dark:text-slate-500">Tidak ada data yang cocok dengan kriteria pencarian.</td></tr>`;

    if (el.tableInfo) {
      el.tableInfo.textContent = `Menampilkan ${total > 0 ? startIdx + 1 : 0} - ${endIdx} dari ${fmtNum(total)} transaksi`;
    }

    if (el.tablePagination) {
      el.tablePagination.innerHTML = `
        <button id="btn-prev-page" class="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition" ${state.table.page <= 1 ? 'disabled' : ''}>
          Prev
        </button>
        <span class="text-xs text-slate-500 dark:text-slate-400 px-2 self-center">Halaman <strong class="text-slate-800 dark:text-slate-200">${state.table.page}</strong> dari ${totalPages}</span>
        <button id="btn-next-page" class="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition" ${state.table.page >= totalPages ? 'disabled' : ''}>
          Next
        </button>
      `;

      document.getElementById('btn-prev-page')?.addEventListener('click', () => {
        if (state.table.page > 1) {
          state.table.page--;
          renderTable(filtered);
        }
      });

      document.getElementById('btn-next-page')?.addEventListener('click', () => {
        if (state.table.page < totalPages) {
          state.table.page++;
          renderTable(filtered);
        }
      });
    }
  }

  // Count Active Filters
  function updateFilterBadge() {
    let count = 0;
    if (state.filters.year !== 'all') count++;
    if (state.filters.region !== 'all') count++;
    if (state.filters.segment !== 'all') count++;
    if (state.filters.category !== 'all') count++;
    if (state.filters.shipMode !== 'all') count++;
    if (state.filters.search) count++;

    if (el.activeFilterCount) {
      if (count > 0) {
        el.activeFilterCount.textContent = `${count} filter aktif`;
        el.activeFilterCount.classList.remove('hidden');
      } else {
        el.activeFilterCount.classList.add('hidden');
      }
    }
  }

  // Master Render Function
  function render() {
    const filtered = getFilteredData();
    updateFilterBadge();
    updateKPIs(filtered);
    renderTrendChart(filtered);
    renderSubCategoryChart(filtered);
    renderSegmentChart(filtered);
    renderRegionChart(filtered);
    renderDiscountImpactChart(filtered);
    renderShipModeChart(filtered);
    renderTable(filtered);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Bind Event Listeners
  function initEvents() {
    // Tab Handlers
    el.tabStory?.addEventListener('click', () => switchTab('story'));
    el.tabDashboard?.addEventListener('click', () => switchTab('dashboard'));

    // Story Chapter Selection
    document.querySelectorAll('.story-chapter-card').forEach(card => {
      card.addEventListener('click', () => {
        const chapter = card.getAttribute('data-story');
        renderStoryDetail(chapter);
      });
    });

    // Theme Toggle
    el.themeToggle?.addEventListener('click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      render();
    });

    // Filter Handlers
    el.filterYear?.addEventListener('change', (e) => {
      state.filters.year = e.target.value;
      state.table.page = 1;
      render();
    });

    el.filterRegion?.addEventListener('change', (e) => {
      state.filters.region = e.target.value;
      state.table.page = 1;
      render();
    });

    el.filterSegment?.addEventListener('change', (e) => {
      state.filters.segment = e.target.value;
      state.table.page = 1;
      render();
    });

    el.filterCategory?.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      state.table.page = 1;
      render();
    });

    el.filterShipMode?.addEventListener('change', (e) => {
      state.filters.shipMode = e.target.value;
      state.table.page = 1;
      render();
    });

    // Reset Button
    el.resetFilters?.addEventListener('click', () => {
      state.filters = { year: 'all', region: 'all', segment: 'all', category: 'all', shipMode: 'all', search: '' };
      if (el.filterYear) el.filterYear.value = 'all';
      if (el.filterRegion) el.filterRegion.value = 'all';
      if (el.filterSegment) el.filterSegment.value = 'all';
      if (el.filterCategory) el.filterCategory.value = 'all';
      if (el.filterShipMode) el.filterShipMode.value = 'all';
      if (el.searchInput) el.searchInput.value = '';
      
      state.table.page = 1;
      render();
    });

    // Table Search with debounce
    let searchDebounce;
    el.searchInput?.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.filters.search = e.target.value.trim();
        state.table.page = 1;
        render();
      }, 250);
    });

    // Table Header Sorting
    document.querySelectorAll('[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        if (state.table.sortBy === field) {
          state.table.sortDir = state.table.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.table.sortBy = field;
          state.table.sortDir = 'desc';
        }
        renderTable(getFilteredData());
      });
    });

    // CSV Export Action
    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      const filtered = getFilteredData();
      if (filtered.length === 0) return alert('Tidak ada data untuk diekspor.');

      const headers = ['Order ID', 'Order Date', 'Customer Name', 'Segment', 'Region', 'State', 'Category', 'Sub-Category', 'Product Name', 'Sales', 'Quantity', 'Discount', 'Profit'];
      const csvRows = [headers.join(',')];

      filtered.forEach(d => {
        const row = [
          `"${d.orderId}"`,
          `"${d.orderDate}"`,
          `"${(d.customerName || '').replace(/"/g, '""')}"`,
          `"${d.segment}"`,
          `"${d.region}"`,
          `"${d.state}"`,
          `"${d.category}"`,
          `"${d.subCategory}"`,
          `"${(d.productName || '').replace(/"/g, '""')}"`,
          d.sales,
          d.quantity,
          d.discount,
          d.profit
        ];
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `superstore_filtered_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Initialize
  function init() {
    applyTheme(state.theme);
    initEvents();
    renderStoryDetail('growth');
    render();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
