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

    // Không chứa số hoặc ký tự đặc biệt (ngoại trừ dấu tiếng Việt và dấu cách)
    const regex = /^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂÂÊÔƠƯa-zàáâãèéêìíòóôõùúăđĩũơưăâêôơư\s']+$/;
    if (!regex.test(name)) return 'Tên không chứa số hoặc ký tự đặc biệt.';

    // Ít nhất 2 từ
    const words = name.trim().split(/\s+/);
    if (words.length < 2) return 'Tên phải có ít nhất 2 từ.';

    // Không được viết in thường đầu câu
    if (name[0] === name[0].toLowerCase()) return 'Tên phải viết hoa chữ cái đầu.';

    // Kiểm tra từng từ phải viết hoa đầu tiên
    for (let word of words) {
        if (word[0] !== word[0].toUpperCase() || word.slice(1) !== word.slice(1).toLowerCase()) {
            return 'Tên phải viết hoa chữ cái đầu.';
        }
    }

    return null;
}