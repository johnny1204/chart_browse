const $ = require('jquery');
$('#close').on('click', () => {
    const process = require('child_process');
    process.exec('npm start');
    // $("#calendar").attr('src', '');
    // alert('終了しました。')
})