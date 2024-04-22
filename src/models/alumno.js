class Alumno{
    constructor(username, DNI, edad)
    {
        this.username= username;
        this.edad=edad;
        this.DNI=DNI;
    }
    ToString() {
        return {
            username: this.username,
            edad: this.edad,
            DNI: this.DNI
        };
    }
}

export {Alumno};