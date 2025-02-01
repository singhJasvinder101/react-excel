const validateAndParseDate = (dateStr) => {
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/; // Match DD-MM-YYYY format
    const match = dateStr.match(dateRegex);

    if (!match) {
        return { valid: false, message: 'Invalid date format. Use DD-MM-YYYY.' };
    }

    const [_, day, month, year] = match.map(Number);
    const dateObj = new Date(year, month - 1, day); // JS months are 0-based

    if (isNaN(dateObj.getTime()) || dateObj.getDate() !== day) {
        return { valid: false, message: 'Invalid date value.' };
    }

    const now = new Date();
    if (dateObj.getMonth() !== now.getMonth() || dateObj.getFullYear() !== now.getFullYear()) {
        return { valid: false, message: 'Date must be within the current month.' };
    }

    return { valid: true, date: dateObj };
}
module.exports = {
    validateAndParseDate
}