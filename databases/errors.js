export const handleError = (error) => {
    if (error.code) {
        switch (error.code) {
            case "23502":
                return {
                    code: 400,
                    msg: "Campo obligatorio",
                };
            case "23505":
                return {
                    code: 400,
                    msg: "este registro ya existe",
                };
            case "22P02":
                return {
                    code: 400,
                    msg: "dato no compatible, intente otra vez",
                };

            default:
                return {
                    code: 500,
                    msg: "Database error",
                };
        }
    }

    return {
        code: 500,
        msg: "Server error",
    };
};
