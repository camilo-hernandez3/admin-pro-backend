const {Schema, model} = require('mongoose');


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        reuired: true,
    },
    email:{
        type: String,
        reuired: true,
        unique: true,
    },
    password:{
        type: String,
        reuired: true,
    },
    img:{
        type: String,
    },
    role:{
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google:{
        type: Boolean,
        default: false
    },

});

UsuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object} = this.toObject();

    object.id = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);
