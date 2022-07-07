document.getElementById('close').addEventListener('click', function () {
    var process = require('child_process');
    const a = process.exec('npm start');
    alert(a)
    // $("#calendar").attr('src', '');
    // alert('終了しました。')
});
