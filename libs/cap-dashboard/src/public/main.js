(function () {
    const API_BASE = '/api/cap';
    // state
    let activeTab = 'outbox';
    let page = 1;
    const limit = 20;

    function $(id) { return document.getElementById(id) }

    function toISO(d) { if (!d) return ''; try { return new Date(d).toISOString() } catch (e) { return String(d) } }

    async function fetchList() {
        const topic = $('filter-topic').value.trim();
        const mode = (document.getElementById('filter-mode') && document.getElementById('filter-mode').value) || 'all';
        const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (topic) qs.set('topic', topic);
        // mode handling: 'all' or 'due'
        if (mode === 'due') {
            if (activeTab === 'inbox') qs.set('due', 'true');
            if (activeTab === 'outbox') qs.set('onlyUnpublished', 'true');
        }

        const url = `${API_BASE}/${activeTab}?${qs.toString()}`;
        renderListLoading();
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            renderList(data.items || data);
            renderPagination(data.page || 1, data.total || (data.items ? data.items.length : 0), data.limit || limit);
        } catch (err) {
            renderListError(err.message);
        }
    }

    function renderListLoading() {
        $('list').innerHTML = '<div class="small">Loading...</div>';
        $('detail').innerHTML = '';
        $('detail-actions').innerHTML = '';
    }

    function renderListError(msg) {
        $('list').innerHTML = `<div class="small">Error loading list: ${msg}</div>`;
    }

    function renderList(items) {
        if (!items || items.length === 0) { $('list').innerHTML = '<div class="small">No items</div>'; return }
        const html = items.map(it => {
            const when = it.occurredAt ? toISO(it.occurredAt) : '';
            const preview = it.payloadPreview || (it.payload ? JSON.stringify(it.payload).slice(0, 160) : '');
            return `<div class="item" data-id="${it.id}"><strong>${it.topic}</strong><div class="meta">${when} • ${it.retryCount || 0} retries • ${it.status || (it.processed ? 'processed' : 'pending')}</div><div class="small">${escapeHtml(preview)}</div></div>`;
        }).join('');
        $('list').innerHTML = html;
        Array.from(document.querySelectorAll('#list .item')).forEach(el => el.addEventListener('click', () => {
            const id = el.getAttribute('data-id'); loadDetail(id);
        }));
    }

    function renderPagination(current, total, limit) {
        const pages = Math.max(1, Math.ceil((total || 0) / limit));
        $('pagination').innerHTML = `Page ${current} / ${pages}`;
    }

    async function loadDetail(id) {
        $('detail').innerHTML = '<div class="small">Loading...</div>';
        $('detail-actions').innerHTML = '';
        try {
            const res = await fetch(`${API_BASE}/${activeTab}/${id}?full=true`);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const item = await res.json();
            renderDetail(item);
        } catch (err) {
            $('detail').innerHTML = `<div class="small">Error loading detail: ${err.message}</div>`;
        }
    }

    function renderDetail(item) {
        if (!item) { $('detail').innerHTML = '<div class="small">Not found</div>'; return }
        const meta = `<div class="small">Topic: ${escapeHtml(item.topic)}<br/>Occured: ${toISO(item.occurredAt)}<br/>Retries: ${item.retryCount || 0}<br/>Status: ${item.status || (item.processed ? 'processed' : 'pending')}</div>`;
        const payload = `<pre>${escapeHtml(JSON.stringify(item.payload || item, null, 2))}</pre>`;
        $('detail').innerHTML = meta + payload;

        const actions = [];
        if (activeTab === 'outbox') {
            actions.push(`<button class="button" id="action-retry">Retry</button>`);
            actions.push(`<button class="button" id="action-mark">Mark Published</button>`);
        } else {
            actions.push(`<button class="button" id="action-retry">Retry</button>`);
            actions.push(`<button class="button" id="action-mark">Mark Processed</button>`);
        }
        $('detail-actions').innerHTML = actions.join(' ');
        bindDetailActions(item.id);
    }

    function bindDetailActions(id) {
        const retryBtn = $('action-retry');
        const markBtn = $('action-mark');
        if (retryBtn) retryBtn.addEventListener('click', () => doAction('retry', id));
        if (markBtn) markBtn.addEventListener('click', () => doAction('mark', id));
    }

    async function doAction(action, id) {
        const url = action === 'retry' ? `${API_BASE}/${activeTab}/${id}/retry` : (action === 'mark' ? `${API_BASE}/${activeTab}/${id}/${activeTab === 'outbox' ? 'mark-published' : 'mark-processed'}` : null);
        if (!url) return;
        try {
            const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ force: false }) });
            const data = await res.json().catch(() => ({ ok: res.ok }));
            alert('Action result: ' + (data.message || JSON.stringify(data)));
            // refresh list/detail
            fetchList();
            loadDetail(id);
        } catch (err) {
            alert('Action failed: ' + err.message);
        }
    }

    function escapeHtml(s) { if (s == null) return ''; return String(s).replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt', '\\': '\\\\', '"': '&quot;' }[c] || c)); }

    // UI wiring
    function init() {
        $('tab-outbox').addEventListener('click', () => { switchTab('outbox') });
        $('tab-inbox').addEventListener('click', () => { switchTab('inbox') });
        $('btn-refresh').addEventListener('click', () => fetchList());
        const fm = document.getElementById('filter-mode');
        if (fm) fm.addEventListener('change', () => fetchList());
        // initial
        switchTab('outbox');
    }

    function switchTab(t) { activeTab = t; page = 1; document.getElementById('tab-outbox').classList.toggle('active', t === 'outbox'); document.getElementById('tab-inbox').classList.toggle('active', t === 'inbox'); fetchList(); }

    // expose for debugging
    window.__capDashboard = { fetchList, loadDetail };

    document.addEventListener('DOMContentLoaded', init);
})();
