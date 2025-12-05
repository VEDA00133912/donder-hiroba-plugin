(function() {
    'use strict';
    const $ = window.jQuery;
    if (!$) return;
    if (window.location.href.indexOf('score_list') === -1) return;

    const STORAGE_KEYS = {
        CROWN: 'activeCrown',
        URA: 'activeUra'
    };

    const SELECTORS = {
        TARGET_CONTAINER: '#tabList',
        CONTENT_BOX: '.contentBox',
        SEARCH_INPUT: '#songSearchInput',
        FILTER_BTN_CROWN: '.filterBtn[data-type="crown"]',
        FILTER_BTN_URA: '.filterBtn[data-type="ura"]'
    };

    const STYLES = `
        .customFiltersLi {
            width: 100%;
            padding: 5px 0;
            list-style: none;
        }
        #songSearchInput {
            width: 100%;
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 5px;
            border: 1px solid #ccc;
            box-sizing: border-box;
        }
        #customFilters {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .filterRow {
            display: flex;
            gap: 5px;
        }
        .filterBtn {
            flex: 1;
            padding: 5px 10px;
            background: #444;
            color: #fff;
            border-radius: 5px;
            border: 2px solid #222;
            cursor: pointer;
            outline: none;
            transition: background 0.2s;
        }
        .filterBtn.active {
            background: #ff9800;
            border-color: #fff;
        }
    `;
    
    initScoreFilter();

    function initScoreFilter() {
        // cssの追加
        injectStyles();

        // 初期化
        const state = {
            crown: localStorage.getItem(STORAGE_KEYS.CROWN),
            ura: localStorage.getItem(STORAGE_KEYS.URA),
            query: ''
        };

        // UI構築
        renderFilterUI();

        // 楽曲データの解析と取得
        const songList = parseSongList();

        // 初期表示の更新
        updateView(state, songList);

        // イベントリスナーの設定
        bindEvents(state, songList);
    }
    
    // CSSの追加
    function injectStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);
    }

    function renderFilterUI() {
        const html = `
        <li class='customFiltersLi'>
            <input type='text' id='songSearchInput' placeholder='曲名で検索'>
            <div id='customFilters'>
                <div class='filterRow'>
                    <button class='filterBtn' data-type='crown' data-value='donderfull'>全良</button>
                    <button class='filterBtn' data-type='crown' data-value='gold'>フルコンボ</button>
                </div>
                <div class='filterRow'>
                    <button class='filterBtn' data-type='crown' data-value='silver'>クリア</button>
                    <button class='filterBtn' data-type='crown' data-value='played'>未クリア</button>
                    <button class='filterBtn' data-type='crown' data-value='none'>未プレイ</button>
                </div>
                <div class='filterRow' style='margin-top:5px;'>
                    <button class='filterBtn' data-type='ura' data-value='normal'>おに譜面</button>
                    <button class='filterBtn' data-type='ura' data-value='ura'>おに(裏譜面)</button>
                </div>
            </div>
        </li>`;
        
        $(SELECTORS.TARGET_CONTAINER).append(html);
    }

    function parseSongList() {
        const list = [];
        $(SELECTORS.CONTENT_BOX).each(function() {
            const $el = $(this);
            const songName = $el.find('.songName, .songNameFontkids').text().trim();
            const crownImgSrc = $el.find('.buttonList li:nth-child(4) a img').attr('src') || '';
            
            list.push({
                element: $el,
                songName: songName,
                crown: getCrownType(crownImgSrc),
                isUra: $el.find('.songNameArea.ura.clearfix').length > 0
            });
        });
        return list;
    }

    function getCrownType(src) {
        if (src.includes('donderfull')) return 'donderfull';
        if (src.includes('gold')) return 'gold';
        if (src.includes('silver')) return 'silver';
        if (src.includes('played')) return 'played';
        return 'none';
    }

    function updateView(state, songList) {
        updateButtonStyles(state);
        filterList(state, songList);
    }

    function updateButtonStyles(state) {
        $('.filterBtn').removeClass('active');
        
        if (state.crown) {
            $(`.filterBtn[data-type="crown"][data-value="${state.crown}"]`).addClass('active');
        }
        if (state.ura) {
            $(`.filterBtn[data-type="ura"][data-value="${state.ura}"]`).addClass('active');
        }
    }

    function filterList(state, songList) {
        songList.forEach(song => {
            let isVisible = true;

            // 王冠
            if (state.crown && song.crown !== state.crown) {
                isVisible = false;
            }
            // 裏譜面
            if (state.ura) {
                if (state.ura === 'ura' && !song.isUra) isVisible = false;
                if (state.ura === 'normal' && song.isUra) isVisible = false;
            }
            // 検索
            if (state.query && !song.songName.toLowerCase().includes(state.query.toLowerCase())) {
                isVisible = false;
            }

            // 表示切り替え
            isVisible ? song.element.show() : song.element.hide();
        });
    }

    function bindEvents(state, songList) {
        // 王冠、裏譜面ボタンのクリック
        $('.filterBtn').on('click', function() {
            const $btn = $(this);
            const type = $btn.data('type'); // 'crown' or 'ura'
            const value = $btn.data('value');

            if (type === 'crown') {
                state.crown = (state.crown === value) ? null : value;
                localStorage.setItem(STORAGE_KEYS.CROWN, state.crown || ''); // nullなら空文字保存でも可
                if(!state.crown) localStorage.removeItem(STORAGE_KEYS.CROWN);
            } else if (type === 'ura') {
                state.ura = (state.ura === value) ? null : value;
                localStorage.setItem(STORAGE_KEYS.URA, state.ura || '');
                if(!state.ura) localStorage.removeItem(STORAGE_KEYS.URA);
            }

            updateView(state, songList);
        });

        // 検索ボックス入力
        $(SELECTORS.SEARCH_INPUT).on('input', function() {
            state.query = $(this).val().trim();
            updateView(state, songList);
        });
    }

})();
