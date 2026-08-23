/* ============================================================
   دورة بايثون المكثفة — سكربت موحد
   Python Crash Course — Unified Script
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1) شريط تقدم القراءة ---------- */
  var prog = document.createElement('div');
  prog.className = 'reading-progress';
  prog.innerHTML = '<span class="bar"></span>';
  document.body.appendChild(prog);
  var progBar = prog.querySelector('.bar');
  function updateProgress() {
    var h = document.documentElement;
    var total = h.scrollHeight - window.innerHeight;
    var pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 2) القائمة الجانبية ---------- */
  var sidebar = document.getElementById('sidebar');
  var toggle = document.getElementById('sidebarToggle');
  if (sidebar && toggle) {
    function updateSidebar() {
      if (window.innerWidth >= 768) {
        document.body.classList.remove('sidebar-active');
        sidebar.classList.remove('open');
        sidebar.style.transform = '';
      } else {
        document.body.classList.remove('sidebar-active');
        sidebar.style.transform = 'translateX(320px)';
        if (!sidebar.classList.contains('open')) {
          sidebar.style.transform = 'translateX(320px)';
        }
      }
    }
    updateSidebar();
    window.addEventListener('resize', updateSidebar);
    toggle.addEventListener('click', function () {
      if (window.innerWidth >= 768) {
        document.body.classList.toggle('sidebar-active');
      } else {
        sidebar.classList.toggle('open');
      }
    });
    var mc = document.querySelector('.main-content');
    if (mc) {
      mc.addEventListener('click', function () {
        if (window.innerWidth < 768 && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
        }
      });
    }
  }

  /* ---------- 3) تمييز الصفحة الحالية ---------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('/').pop() === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---------- 4) ترقيم أسطر كتل الكود + زر النسخ ---------- */
  document.querySelectorAll('.code-block').forEach(function (b) {
    if (b.querySelector('ol')) return;
    var lines = b.innerHTML.split('\n');
    var ol = document.createElement('ol');
    lines.forEach(function (l) {
      var li = document.createElement('li');
      li.innerHTML = l;
      ol.appendChild(li);
    });
    b.innerHTML = '';
    b.appendChild(ol);

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = '📋';
    btn.title = 'نسخ الكود';
    btn.addEventListener('click', function () {
      var c = b.cloneNode(true);
      var cb = c.querySelector('.copy-btn');
      if (cb) cb.remove();
      var code = c.textContent.trim();
      navigator.clipboard.writeText(code).then(function () {
        btn.textContent = '✅';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = '📋';
          btn.classList.remove('copied');
        }, 1500);
      });
    });
    b.appendChild(btn);
  });

  /* ---------- 5) فهرس المحتويات التلقائي ---------- */
  var content = document.querySelector('.chapter-content');
  if (content) {
    var titles = content.querySelectorAll('.section-title');
    if (titles.length > 1) {
      var toc = document.createElement('div');
      toc.className = 'toc-box';
      var ol = document.createElement('ol');
      titles.forEach(function (t, i) {
        if (!t.id) t.id = 'sec-' + (i + 1);
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + t.id;
        var num = document.createElement('span');
        num.className = 'toc-num';
        num.textContent = String(i + 1).padStart(2, '0');
        a.appendChild(num);
        // إزالة رقم القسم البصري من العنوان (أضيف في JS لاحقاً)
        var textEl = document.createElement('span');
        textEl.textContent = t.textContent.trim();
        a.appendChild(textEl);
        li.appendChild(a);
        ol.appendChild(li);
      });
      toc.innerHTML = '<div class="toc-title">📑 محتويات الدرس</div>';
      toc.appendChild(ol);
      content.insertBefore(toc, content.firstChild);

      // إضافة رقم مرئي لكل عنوان قسم (فقط إن لم يبدأ رقماً)
      titles.forEach(function (t, i) {
        var txt = t.textContent.trim();
        if (/^\d/.test(txt)) return;
        var num = document.createElement('span');
        num.className = 'sec-num';
        num.textContent = String(i + 1).padStart(2, '0');
        t.insertBefore(num, t.firstChild);
      });
    }
  }

  /* ---------- 6) تنقل السابق / التالي ---------- */
  var navLinks = document.querySelectorAll('.sidebar-nav a.chapter-link');
  var current = null;
  navLinks.forEach(function (l) {
    if (l.classList.contains('active')) current = l;
  });
  if (current && content && navLinks.length > 1) {
    var prev = null, next = null;
    var found = false;
    for (var i = 0; i < navLinks.length; i++) {
      var link = navLinks[i];
      if (link === current) {
        found = true;
        continue;
      }
      if (!found) prev = link;
      else if (!next) next = link;
    }
    var pn = document.createElement('div');
    pn.className = 'prevnext';
    var html = '';
    if (prev) {
      html += '<a class="prev" href="' + prev.getAttribute('href') + '">' +
        '<span class="pn-label">→ الدرس السابق</span>' +
        '<span class="pn-title">' + prev.textContent.trim() + '</span></a>';
    } else {
      html += '<span></span>';
    }
    if (next) {
      html += '<a class="next" href="' + next.getAttribute('href') + '">' +
        '<span class="pn-label">الدرس التالي ←</span>' +
        '<span class="pn-title">' + next.textContent.trim() + '</span></a>';
    } else {
      html += '<span></span>';
    }
    pn.innerHTML = html;
    content.appendChild(pn);

    var hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.textContent = '👆 اسحب يميناً/يساراً للتنقل بين الدروس';
    content.appendChild(hint);

    /* ---------- 6b) التنقل بالسحب (Swipe) بين الدروس على الهاتف ---------- */
    var prevHref = prev ? prev.getAttribute('href') : null;
    var nextHref = next ? next.getAttribute('href') : null;
    var touchX = null, touchY = null;
    document.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (touchX == null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      touchX = touchY = null;
      // إهمال السحب الرأسي (التمرير) والسحب القصير
      if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 60) return;
      // في RTL: السحب لليمين = التالي، لليسار = السابق
      if (dx > 0) {
        if (nextHref) window.location.href = nextHref;
      } else {
        if (prevHref) window.location.href = prevHref;
      }
    }, { passive: true });
  }

  /* ---------- 7) زر العودة للأعلى ---------- */
  var topBtn = document.createElement('button');
  topBtn.className = 'back-top';
  topBtn.textContent = '↑';
  topBtn.title = 'العودة للأعلى';
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(topBtn);
  window.addEventListener('scroll', function () {
    topBtn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
})();
