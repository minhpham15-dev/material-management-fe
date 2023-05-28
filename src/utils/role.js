export const Role = {
    ADMIN: "1",
    EMPLOYEE: "2"
}
export const PaymentMethod = {
    "1": "Chuyển khoản",
    "2": "Tiền mặt"
}
export  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
