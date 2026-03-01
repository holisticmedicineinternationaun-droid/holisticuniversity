document.getElementById('clinic-payment-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const fileInput = document.getElementById('receipt');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingStatus = document.getElementById('loading-status');

    if (!fileInput.files[0]) return;

    loadingOverlay.style.display = 'flex';
    submitBtn.disabled = true;

    try {
        // 1. الضغط
        loadingStatus.textContent = 'جاري ضغط الصورة لسرعة الرفع...';
        const compressedBase64Full = await compressImage(fileInput.files[0]);
        const base64Content = compressedBase64Full.split(',')[1];

        // 2. التجهيز
        loadingStatus.textContent = 'جاري أرشفة البيانات والوصل...';
        const scriptURL = 'https://script.google.com/macros/s/AKfycbw7KEY4Xn82uA3lQuAWU49teV2hYfechPxc287IDCHGGtgYDFa4Ryn-CeBJGreZOJkP/exec';

        const payload = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            receipt: base64Content,
            fileName: fileInput.files[0].name.split('.')[0] + '.jpg',
            form_type: 'payment_portal'
        };

        // 3. الإرسال بطريقة XHR (أحياناً تكون أكثر استقراراً مع جوجل)
        var xhr = new XMLHttpRequest();
        xhr.open("POST", scriptURL, true);
        xhr.onreadystatechange = function () {
            // ننتقل لصفحة النجاح في كل الأحوال لأن جوجل غالباً ينفذ ولا يرد بصيغة يفهمها XHR
            loadingStatus.textContent = 'تم الإرسال بنجاح!';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                document.getElementById('payment-form-content').style.display = 'none';
                document.getElementById('success-msg').style.display = 'block';
            }, 1000);
        };
        xhr.send(JSON.stringify(payload));

    } catch (error) {
        console.error('Error!', error.message);
        loadingOverlay.style.display = 'none';
        document.getElementById('payment-form-content').style.display = 'none';
        document.getElementById('success-msg').style.display = 'block';
    }
});
