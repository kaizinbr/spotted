const menu_btn = document.querySelector('.menu-btn');
const menu_title = document.querySelector('.menu-header-title');

menu_btn.addEventListener('click', () => {
    document.querySelector('.navbar').classList.toggle('show');
    document.querySelector('nav').style.display = 'flex';
    
    document.querySelector('.menu-btn').classList.toggle('show');
    document.querySelector('.menu-header-title').classList.toggle('show');
});