function init(){
    const wrappers = document.querySelectorAll('.wrapper');
    Object.values(wrappers).map(wrapper => {
        new SlideHorizontal(wrapper, {
            position: 'start',
            elementsPerView: 5,
            step: 1,
        });
    })
}init();


// position: start, center, end // default is start
// step: children width * step // default is 1