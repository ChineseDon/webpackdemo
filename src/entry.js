import css from "./css/index.css";
import less from './css/index2.less';
import sass from './css/inde3.scss';

{
    const jspang = 'jspang'
    $('#title').html('Heloo jspang')
    //document.getElementById("title").innerHTML = jspang;
}

var json = require("../config.json");
$("#json").html(json.name);