export const validateUserForm = (data) => {
    if (!data.name || data.name.length < 20 || data.name.length > 60) {
        return "Name must be between 20 and 60 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        return "Please enter a valid email address.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!data.password || !passwordRegex.test(data.password)) {
        return "Password must be 8-16 characters long and include at least one uppercase letter and one special character.";
    }

    if (!data.address || data.address.length > 400) {
        return "Address cannot exceed 400 characters.";
    }

    return null; 
};