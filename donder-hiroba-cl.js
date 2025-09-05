(function() {
    'use strict';
    const $ = window.jQuery;

    if (window.location.href.indexOf('score_list') > 0) {
        scoreListFilter();
    }

    function scoreListFilter(){
        let activeCrown = localStorage.getItem('activeCrown') || null;
        let activeUra = localStorage.getItem('activeUra') || null;
        let searchQuery = '';

        const buttonsHtml = `
        <li class='customFiltersLi' style='width:100%; padding:5px 0;'>
            <input type='text' id='songSearchInput' placeholder='曲名で検索'
       style='width:calc(100%); padding:5px 8px; margin-bottom:5px; border-radius:5px; border:1px solid #ccc; box-sizing:border-box;'>

            <div id='customFilters' style='display:flex; flex-direction:column; gap:5px;'>
                <div style='display:flex; gap:5px;'>
                    <button class='filterBtn crownBtn' data-crown='donderfull' style='flex:1; padding:5px 10px; background:#444; color:#fff; border-radius:5px; border:2px solid #222; cursor:pointer; outline:none;'>全良</button>
                    <button class='filterBtn crownBtn' data-crown='gold' style='flex:1; padding:5px 10px; background:#444; color:#fff; border-radius:5px; border:2px solid #222; cursor:pointer; outline:none;'>フルコンボ</button>
                </div>
                <div style='display:flex; gap:5px;'>
                    <button class='filterBtn crownBtn' data-crown='silver' style='flex:1; padding:5px 10px; background:#444; color:#fff; border-radius:5px; border:2px solid #222; cursor:pointer; outline:none;'>クリア</button>
                    <button class='filterBtn crownBtn' data-crown='played' style='flex:1; padding:5px 10px; background:#444; color:#fff; border-radius:5px; border:2px solid #222; cursor:pointer; outline:none;'>未クリア</button>
                    <button class='filterBtn crownBtn' data-crown='none' style='flex:1; padding:5px 10px; background:#444; color:#fff; border-radius:5px; border:2px solid #222; cursor:pointer; outline:none;'>未プレイ</button>
                </div>
                <div style='display:flex; gap:5px; margin-top:5px;'>
                    <button class='filterBtn uraBtn' data-ura='normal' style='flex:1; padding:5px 10px; background:#444; color:#fff; border-radius:5px; border:2px solid #222; cursor:pointer; outline:none;'>おに譜面</button>
                    <button class='filterBtn uraBtn' data-ura='ura' style='flex:1; padding:5px 10px; background:#444; color:#fff; border-radius:5px; border:2px solid #222; cursor:pointer; outline:none;'>おに(裏譜面)</button>
                </div>
            </div>
        </li>`;

        $('#tabList').append(buttonsHtml);

        // 曲情報の取得
        const songList = [];
        $('.contentBox').each(function(){
            const songName = $(this).find('.songName, .songNameFontkids').text().trim();
            const crownImg = $(this).find('.buttonList li:nth-child(4) a img').attr('src') || '';
            let crownStatus = 'none';
            if(crownImg.indexOf('donderfull') > 0) crownStatus = 'donderfull';
            else if(crownImg.indexOf('gold') > 0) crownStatus = 'gold';
            else if(crownImg.indexOf('silver') > 0) crownStatus = 'silver';
            else if(crownImg.indexOf('played') > 0) crownStatus = 'played';

            const isUra = $(this).find('.songNameArea.ura.clearfix').length > 0;

            songList.push({
                element: $(this),
                songName: songName,
                crown: crownStatus,
                ura: isUra
            });
        });

        function updateFilter() {
            songList.forEach(item => {
                let show = true;
                if(activeCrown && item.crown !== activeCrown) show = false;
                if(activeUra && ((activeUra === 'ura' && !item.ura) || (activeUra === 'normal' && item.ura))) show = false;
                if(searchQuery && !item.songName.toLowerCase().includes(searchQuery.toLowerCase())) show = false;
                if(show) item.element.show();
                else item.element.hide();
            });
        }

        function restoreButtonState() {
            $('.crownBtn').each(function(){
                if($(this).data('crown') === activeCrown){
                    $(this).css({'background':'#ff9800','border-color':'#fff'});
                } else {
                    $(this).css({'background':'#444','border-color':'#222'});
                }
            });
            $('.uraBtn').each(function(){
                if($(this).data('ura') === activeUra){
                    $(this).css({'background':'#ff9800','border-color':'#fff'});
                } else {
                    $(this).css({'background':'#444','border-color':'#222'});
                }
            });
            updateFilter();
        }

        restoreButtonState();

        // ボタンクリック
        $('.crownBtn').click(function(){
            const selected = $(this).data('crown');
            if(activeCrown === selected){
                activeCrown = null;
            } else {
                activeCrown = selected;
            }
            localStorage.setItem('activeCrown', activeCrown);
            restoreButtonState();
        });

        $('.uraBtn').click(function(){
            const selected = $(this).data('ura');
            if(activeUra === selected){
                activeUra = null;
            } else {
                activeUra = selected;
            }
            localStorage.setItem('activeUra', activeUra);
            restoreButtonState();
        });

        // 検索ボックス
        $('#songSearchInput').on('input', function(){
            searchQuery = $(this).val().trim();
            updateFilter();
        });
    }
})();
