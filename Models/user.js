class Usuario{
    constructor(id,data){
        this.bandera=0;
        this.id=id;
        this.nombre=data.nombre;
        this.usuario=data.usuario;
        this.password=data.password;
        this.edad=data.edad;
        this.correo=data.correo;
        this.tipo=data.tipo;
        this.telefono=data.telefono;
        this.salt=data.salt;
        this.foto=data.foto;
    }
    set id(id){
        if(id!=null)
       id.length>0? this._id=id:this.bandera=1;
    }
    set nombre(nombre){
        nombre.length>0?this._nombre=nombre:this.bandera=1;
    }
    set usuario(usuario){
       usuario.length>0? this._usuario=usuario:this.bandera=1;
    }
    set password(password){
       password.length>0? this._password=password:this.bandera=1;
    }
    set edad(edad){
        edad.length>0?this._edad=edad:this.bandera=1;
    }
    set correo(correo){
        correo.length>0?this._correo=correo:this.bandera=1;
    }
    set telefono(telefono){
        telefono.length>0?this._telefono=telefono:this.bandera=1;
    }
    set tipo(tipo) {
        tipo.length>0?this._tipo=tipo:this.bandera=1;

    }

   

    set salt(salt){
        salt.length>0? this._salt=salt:this.bandera=1;
    }

    set foto(foto){
        foto.length>0? this._foto=foto:this.bandera=1;
    }

    get id(){
        return this._id;
    }
    get nombre(){
        return this._nombre;
    }
    get usuario(){
        return this._usuario;
    }
    get password(){
        return this._password;
    }
    get edad(){
        return this._edad;
    }
    get correo(){
        return this._correo;
    }
    get telefono(){
        return this._telefono;
    }
    get tipo() {
        return this._tipo;
    }

    get salt(){
        return this._salt;
    }

    get foto(){
        return this._foto;
    }
    get obtenerUsuario(){
        if(this._id==null){
            return{
                nombre:this.nombre,
                usuario:this.usuario,
                password:this.password,
                edad:this.edad,
                correo:this.correo,
                telefono:this.telefono,
                tipo:this.tipo,
                salt:this.salt,
                foto:this.foto
            }
        }
        else{
            return{
                id:this.id,
                nombre:this.nombre,
                usuario:this.usuario,
                password:this.password,
                edad:this.edad,
                correo:this.correo,
                telefono:this.telefono,
                tipo:this.tipo,
                salt:this.salt,
                foto:this.foto
            }               
        }
    }
}
module.exports=Usuario;