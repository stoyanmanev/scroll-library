
function SlideHorizontal(wrapper, props) {
    const globals = {
        currentPosition: 0,
        endPoints: {
            start: 0,
            end: 0
        },
        userType: getDeviceType(),
    }
    if(typeof wrapper !== 'object' && typeof wrapper !== 'string') throw new Error('invalid selector');
    if(typeof wrapper === 'string') wrapper = document.querySelector(wrapper);
    if(!wrapper.classList.contains('scroll-container-initialized')) return initialize(wrapper, props);
    
    async function initialize(wrapper, props){
        wrapper.style.transform = 'translateX(0px)';
        await setEndPoint(wrapper, props);
        setEvents(wrapper)
        wrapper.classList.add('scroll-container-initialized');
    }
    
    function setEvents(target){
        if(globals.userType === 'desktop'){
            target.addEventListener('mouseover', (e) => {
                target.addEventListener('wheel', eventScroll, {passive: false});
            })
            target.addEventListener('mouseleave', (e) => {
                target.removeEventListener('wheel', eventScroll, {passive: false});
            })
        }
        if(globals.userType === 'mobile' || globals.userType === 'tablet'){
            globals.touch = {
                start: 0,
                current: 0,
            }
            target.addEventListener('touchstart', eventTouchStart, {passive: false});
            target.addEventListener('touchend', eventTouchEnd, {passive: false});
            target.addEventListener('touchmove', eventTouch, {passive: false});
        }
    }
    
    function eventScroll(e){
        const movePosition = e.deltaY < 0 ? 'up' : 'down';
        
        if(movePosition === 'up'){
            const targetPosition = props.step ? globals.currentPosition - wrapper.children[0].offsetWidth * props.step : globals.currentPosition - wrapper.children[0].offsetWidth * 1;
            if(targetPosition >= globals.endPoints.start) preventScroll(e);
            if(targetPosition <= globals.endPoints.start){
                globals.currentPosition = globals.endPoints.start;
                return moveWrapper(globals.currentPosition);
            }else{
                moveWrapper(targetPosition);
            }
        }
        if(movePosition === 'down'){
            const targetPosition = props.step ? globals.currentPosition + wrapper.children[0].offsetWidth * props.step : globals.currentPosition + wrapper.children[0].offsetWidth * props.step;
            if(targetPosition <= globals.endPoints.end) preventScroll(e);
            if(targetPosition >= globals.endPoints.end){
                globals.currentPosition = globals.endPoints.end;
                return moveWrapper(globals.currentPosition);
            }else{
                moveWrapper(targetPosition);
            }
        }
    }

    function eventTouch(e){
        if(globals.touch.current === e.targetTouches[0].screenX) return false;
        const movePosition = globals.touch.current > e.targetTouches[0].screenX ? 'right' : 'left';
        globals.touch.current = e.targetTouches[0].screenX;
        console.log(movePosition)
        if(movePosition === 'left'){
            const targetPosition = globals.touch.current - globals.touch.start;
            
            globals.currentPosition = globals.currentPosition - (targetPosition / 10);
            console.log(globals.currentPosition)
            if(globals.currentPosition < globals.endPoints.start){
                globals.currentPosition = globals.endPoints.start;
                return moveWrapper(globals.currentPosition)
            }else{
                moveWrapper(globals.currentPosition)
            }
        }
        if(movePosition === 'right'){
            const targetPosition = globals.touch.start - globals.touch.current;
            globals.currentPosition = globals.currentPosition + (targetPosition / 10);
            if(globals.currentPosition > globals.endPoints.end){
                globals.currentPosition = globals.endPoints.end;
                return moveWrapper(globals.currentPosition)
            }else{
                moveWrapper(globals.currentPosition)
            }
        }
    }
    function eventTouchEnd(){
        
    }

    function eventTouchStart(e){
        globals.touch.start = e.targetTouches[0].screenX;
        globals.touch.current = e.targetTouches[0].screenX;
    }
    
    function setEndPoint(w, p){
        return new Promise(resolve => {
            if(p.position === 'start' || typeof p.position === 'undefined'){
                globals.endPoints.start = 0;
                globals.endPoints.end = w.scrollWidth - w.children[0].offsetWidth * p.elementsPerView;
                console.log(globals)
            }else if(p.position === 'end'){
                globals.endPoints.start = w.scrollWidth - w.children[0].offsetWidth * p.elementsPerView;
                globals.endPoints.end = 0;
            }else if(p.position === 'center'){
                globals.endPoints.start = (w.scrollWidth - w.children[0].offsetWidth * p.elementsPerView) / 2;
                globals.endPoints.end = w.scrollWidth - w.children[0].offsetWidth * p.elementsPerView;
            }
            resolve(true);
        })
    }
    
    function preventScroll(e){
        e.preventDefault();
        e.stopPropagation();
    }

    function moveWrapper(position){
        globals.currentPosition = position;
        wrapper.style.transform = `translateX(-${position}px)`;
    }
}
      
function getDeviceType (){
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
        )
    ) {
        return "mobile";
    }
    return "desktop";
};