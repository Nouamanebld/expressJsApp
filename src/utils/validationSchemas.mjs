export const createUserValidationSchema = {
    userName: {
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: 'Username must be between 5 and 32',
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty',
        },
        isString: {
            errorMessage: 'Username must be a string',
        },
    },
    displayName: {
        notEmpty: {
            errorMessage: 'displayName cannot be empty'
        },
    }
};