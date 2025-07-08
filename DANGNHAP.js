// document.getElementById("goHome").addEventListener("click", function () {
//     window.location.href = "home.html";
// });
let faceMode = ""; 
    
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});
// Khi tải trang dk.html, hiển thị form Đăng nhập
window.addEventListener("load", () => {
  document.getElementById("container").classList.remove("right-panel-active");
});

// Nút chuyển qua Đăng ký
document.getElementById("signUp").addEventListener("click", () => {
  document.getElementById("container").classList.add("right-panel-active");
});

// Nút chuyển qua Đăng nhập
document.getElementById("signIn").addEventListener("click", () => {
  document.getElementById("container").classList.remove("right-panel-active");
});



document.getElementById('face-login-btn').onclick = function() {
    faceMode = "login";
    document.getElementById('face-modal').style.display = 'flex';
    document.querySelector('#face-modal h2').innerText = 'Nhận diện khuôn mặt';
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('face-video');
            video.srcObject = stream;
            video.onloadedmetadata = function() { video.play(); };
        })
        .catch(err => {
            alert('Không thể truy cập camera: ' + err.message);
        });
};

document.getElementById('face-register-btn').onclick = function() {
    faceMode = "register";
    document.getElementById('face-modal').style.display = 'flex';
    document.querySelector('#face-modal h2').innerText = 'Đăng ký khuôn mặt';
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('face-video');
            video.srcObject = stream;
            video.onloadedmetadata = function() { video.play(); };
        })
        .catch(err => {
            alert('Không thể truy cập camera: ' + err.message);
        });
};

document.getElementById('close-face-modal').onclick = function() {
    document.getElementById('face-modal').style.display = 'none';
    let video = document.getElementById('face-video');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
};

// Gán sự kiện cho nút xác nhận chỉ 1 lần duy nhất
document.getElementById('capture-face-btn').onclick = function() {
    let video = document.getElementById('face-video');
    let canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    canvas.getContext('2d').drawImage(video, 0, 0, 320, 240);
    let imageData = canvas.toDataURL('image/png');

    let url, bodyData;
    if (faceMode === "register") {
        url = '/face-register/';
        let username = document.querySelector('input[name="username"]').value;
        bodyData = JSON.stringify({ image: imageData, username: username });
    } else {
        url = '/face-login/';
        bodyData = JSON.stringify({ image: imageData });
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById('csrf_token').value
        },
        body: bodyData
    })
    .then(async response => {
    if (!response.ok) {

        const text = await response.text();
        throw new Error('Server error: ' + text);
    }

    return response.json();
})
      .then(data => {
      if (faceMode === "register") {
          if (data.success) {
              alert('Đăng ký khuôn mặt thành công!');
              document.getElementById('face-modal').style.display = 'none';
          } else {
              alert(data.message || 'Đăng ký khuôn mặt thất bại');
          }
      } else {
          if (data.success) {
              window.location.href = '/trangchu/';
          } else {
              alert('Nhận diện thất bại!');
          }
      }
  })
    .catch(error => {
        alert('Có lỗi xảy ra: ' + error);
    });
};