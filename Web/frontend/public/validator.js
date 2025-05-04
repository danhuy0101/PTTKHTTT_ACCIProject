// validator.js sửa lại thành:
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return 'Email phải có dạng user@mail.com';
    }
    return null; // hợp lệ
}

function validatePhone(phone) {
    const regex = /^(0|\+84)[3-9][0-9]{8}$/;
    if (!regex.test(phone)) {
        return 'Số điện thoại chưa đúng định dạng!';
    }
    return null; // hợp lệ
}

function validateName(name) {
    if (!name || typeof name !== 'string') return 'Tên không hợp lệ.';
  
    // Chỉ cho phép chữ cái (mọi ngôn ngữ) và khoảng trắng
    const regex = /^[\p{L}\s']+$/u;
    if (!regex.test(name)) return 'Tên không chứa số hoặc ký tự đặc biệt.';
  
    const words = name.trim().split(/\s+/);
    if (words.length < 2) return 'Tên phải có ít nhất 2 từ.';
  
    // Mỗi từ phải viết hoa chữ cái đầu
    for (let word of words) {
        const firstChar = word.charAt(0);
        const rest = word.slice(1);
    
        // So sánh chữ đầu là viết hoa, phần còn lại là thường (vẫn chấp nhận dấu)
        if (firstChar !== firstChar.toLocaleUpperCase() || rest !== rest.toLocaleLowerCase()) {
          return 'Tên phải viết hoa chữ cái đầu của mỗi từ.';
        }
    }
  
    return null;
}  