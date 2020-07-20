var socket = io.connect();
$(document).ready(function(){
var mang_control_false = [
    $('#dong_co'),
    $('#valve_1_in'),
    $('#valve_2_in'),
    $('#valve_3_in'),
    $('#valve_4_in'),
    $('#valve_5_in'),
    $('#valve_6_in'),
    $('#valve_7_in'),
    $('#valve_8_in'),
    $('#valve_1_out'),
    $('#valve_2_out'),
    $('#valve_3_out'),
    $('#valve_4_out'),
    $('#valve_5_out'),
    $('#valve_6_out'),
    $('#valve_7_out'),
    $('#cuso4'),
    $('#naoh'),
    $('#pac'),
    $('#clo'),
    $('#xa_thai_1_in'),
    $('#xa_thai_2_in'),
    $('#xa_thai_3_in'),
    $('#bon_thai_1_out'),
    $('#bon_thai_2_out')
];
var mang_emergency = [
  $('#dong_co'),
  $('#valve_1_in'),
  $('#valve_2_in'),
  $('#valve_3_in'),
  $('#valve_4_in'),
  $('#valve_5_in'),
  $('#valve_6_in'),
  $('#valve_7_in'),
  $('#valve_8_in'),
  $('#valve_1_out'),
  $('#valve_2_out'),
  $('#valve_3_out'),
  $('#valve_4_out'),
  $('#valve_5_out'),
  $('#valve_6_out'),
  $('#valve_7_out'),
  $('#cuso4'),
  $('#naoh'),
  $('#pac'),
  $('#clo'),
  $('#xa_thai_1_in'),
  $('#xa_thai_2_in'),
  $('#xa_thai_3_in'),
  $('#bon_thai_1_out'),
  $('#bon_thai_2_out'),
  $('#main_switch'),
  $('#mode')
];
$('img.test_emer').on('load', function () {
  if($('#emergency').attr('src') == 'assets/images/hmi/emergency.png'){
    mang_emergency.map((item,index)=>{
      item.css('pointer-events','none');
    }) 
  } else {
    mang_emergency.map((item,index)=>{
      item.css('pointer-events','all');
    }) 
  } 
 });
$('img.test').on('load', function () {
  if($('#mode').attr('src') == 'assets/images/hmi/auto.png'){
    mang_control_false.map((item,index)=>{
      item.css('pointer-events','none');
    }) 
  } else {
    mang_control_false.map((item,index)=>{
      item.css('pointer-events','all');
    }) 
  } 
 });
$('#thongbaotaomoi1').css('display','block');
//#region DOC VE SAU KHI RELOAD
var mang_valve_5 = [
  [$('#error_valve_1_in'),'message51'],
  [$('#error_valve_2_in'),'message52'],
  [$('#error_valve_3_in'),'message53'],
  [$('#error_valve_4_in'),'message54'],
  [$('#error_valve_5_in'),'message55'],
  [$('#error_valve_6_in'),'message56'],
  [$('#error_valve_7_in'),'message57'],
  [$('#error_valve_8_in'),'message58'],
  [$('#error_valve_1_out'),'message59'],
  [$('#error_valve_2_out'),'message60'],
  [$('#error_valve_3_out'),'message61'],
  [$('#error_valve_4_out'),'message62'],
  [$('#error_valve_5_out'),'message63'],
  [$('#error_valve_6_out'),'message64'],
  [$('#error_valve_7_out'),'message65'],
  [$('#error_bon_thai_1_out'),'message66'],
  [$('#error_bon_thai_2_out'),'message67'],
  [$('#error_xa_thai_1_in'),'message68'],
  [$('#error_xa_thai_2_in'),'message69'],
  [$('#error_xa_thai_3_in'),'message70'],
  [$('#error_valve_cuso4'),'message71'],
  [$('#error_valve_naoh'),'message72'],
  [$('#error_valve_pac'),'message73'],
  [$('#error_dong_co'),'message74'],
  [$('#error_valve_clo'),'message75']
]
var value_valve_in = [];
var value_valve_out = [];
var value_den_cam_bien = [];
for(let i = 2 ; i <= 8 ; i++){
  value_valve_in.push($(`#${"valve_" + i + "_in" }`))
}
for(let i = 1 ; i <= 9 ; i++){
  if(i <= 7) {
    value_valve_out.push($(`#${"valve_" + i + "_out" }`))
  } else {
    value_valve_out.push($(`#${"bon_thai_" + [i - 7] + "_out" }`))
  }
}
for(let i = 1 ; i <= 16 ; i++){
  if(i <= 7) {
    value_den_cam_bien.push($(`#${"cb_max_bon_"+ i }`))
  }
  if(i > 7 && i<= 14) {
    value_den_cam_bien.push($(`#${"cb_min_bon_"+ [i - 7] }`))
    
  }
  if(i > 14) {
    value_den_cam_bien.push($(`#${"cb_muc_can_"+ [i - 14] }`))
   
  }
}
var mang_so_lieu = [
  [$('#bon_1'),'message100'],
  [$('#bon_2'),'message101'],
  [$('#bon_3'),'message102'],
  [$('#bon_4'),'message103'],
  [$('#bon_5'),'message104'],
  [$('#bon_6'),'message105'],
  [$('#bon_7'),'message106'],
  [$('#nuoc_da_xu_ly'),'message107'],
  [$('#can_bon_1'),'message108'],
  [$('#can_bon_2'),'message109'],
  [$('#time_hoatdong'),'message95'],
  [$('#time_khu'),'message96'],
  [$('#time_khuay'),'message97'],
  [$('#time_xa_thai_1'),'message98'],
  [$('#time_xa_thai_2'),'message99'],
  [$('#pH'),'message110'],
  [$('#temperature'),'message111'],
  [$('#oxy_hoa_tan'),'message112'],
  [$('#clo_da_dung'),'message113'],
  [$('#ttcuso4'),'message114'],
  [$('#ttnaoh'),'message115'],
  [$('#speed_dc'),'message116'],
  [$('#water_flow'),'message117']
  ]
var value_valve_chemiscal = [
  $('#cuso4'),
  $('#naoh'),
  $('#pac'),
  $('#dong_co'),
  $('#clo')
];
var value_valve_xa_thai = [
  $('#xa_thai_1_in'),
  $('#xa_thai_2_in'),
  $('#xa_thai_3_in'),
]
socket.on('value',function(data){
    var data_valve_in = data.slice(26,33);
    var data_valve_out = data.slice(33,43);
    var data_valve_chemiscal = data.slice(45,51);
    var data_valve_xa_thai = data.slice(42,46);
    var data_den_cam_bien = data.slice(78,94);
    var data_value = data.slice(99,109).concat(data.slice(94,99)).concat(data.slice(109,117));
    var data_error_device = data.slice(50,75);
    // //So lieu
    for(let i = 0 ; i < mang_valve_5.length ; i++){    
        if(data_error_device[i].toString() == "true"){
          mang_valve_5[i][0].css('display','block');
        } else {
          mang_valve_5[i][0].css('display','none');
        }
    }
    for(let i = 0 ; i < mang_so_lieu.length ; i++){
      if(data_value[i] !== undefined){
        mang_so_lieu[i][0].html(`${data_value[i].toFixed(2)}`);
      }
    }
    // VALVE 1
    if(data[25].toString() == "true"){
      $('#valve_1_in').attr('src','assets/images/hmi/'+'pumps_on'+'.png');
    } else {
      $('#valve_1_in').attr('src','assets/images/hmi/'+'pumps'+'_off'+'.png');
    }
    //BON LAM THOANG
    if(data[27].toString() == "true"){
      $('#lamthoang').attr('src','assets/images/hmi/'+'lamthoang'+'.png');
    } else {
      $('#lamthoang').attr('src','assets/images/hmi/'+'lamthoang'+'_off'+'.png');
    }
    //BANG DIEU KHIEN
    if(data[119].toString() == "true"){
      $('#main_switch').attr('src','assets/images/hmi/start'+'.png');
    } else {
      $('#main_switch').attr('src','assets/images/hmi/stop'+'.png');
    }
    if(data[120].toString() == "true"){
      $('#emergency').attr('src','assets/images/hmi/emergency'+'.png');
    } else {
      $('#emergency').attr('src','assets/images/hmi/'+'emergency'+'_off'+'.png');
    }
    if(data[121].toString() == "true"){
      $('#mode').attr('src','assets/images/hmi/'+'auto'+'.png');
    } else {
      $('#mode').attr('src','assets/images/hmi/'+'manu'+'.png');
    }
    //VALVE 2 3 4 5 6 7 8
    for(let i = 0 ; i < value_valve_in.length ; i++ ){
        if(data_valve_in[i].toString() == "true"){
          value_valve_in[i].attr('src','assets/images/hmi/'+'valve_pumps_on'+'.png');
        } else {
          value_valve_in[i].attr('src','assets/images/hmi/'+'valve_pumps'+'_off'+'.png');
        }
    }
    //VALVE XA 1 2 3 4 5 6 7 8
    for(let i = 0 ; i < value_valve_out.length ; i++ ){
        if(data_valve_out[i].toString() == "true"){
          value_valve_out[i].attr('src','assets/images/hmi/'+'valve_xa_on'+'.png');
        } else {
          value_valve_out[i].attr('src','assets/images/hmi/'+'valve_xa'+'_off'+'.png');
        }
    }
    //DEN CANH BAO LUU LUONG
    for(let i = 0 ; i < value_den_cam_bien.length ; i++ ){
        if(data_den_cam_bien[i].toString() == "true"){
          value_den_cam_bien[i].attr('src','assets/images/hmi/'+'cb'+'.png');
        } else {
          value_den_cam_bien[i].attr('src','assets/images/hmi/'+'cb_'+'off'+'.png');
      
    }}

    //VALVE hoa chat va dong co
    for(let i = 0 ; i < value_valve_chemiscal.length ; i++ ){

      if ( i == 3 ) {
        if(data_valve_chemiscal[3].toString() == "true"){
          value_valve_chemiscal[3].attr('src','assets/images/hmi/'+'motor_khuay_on'+'.png');
        } else {
          value_valve_chemiscal[3].attr('src','assets/images/hmi/'+'motor_khuay'+'_off'+'.png');
        }
      } else {
      if(data_valve_chemiscal[i].toString() == "true"){
        value_valve_chemiscal[i].attr('src','assets/images/hmi/'+'valve_hoachat_on'+'.png');
      } else {
        value_valve_chemiscal[i].attr('src','assets/images/hmi/'+'valve_hoachat'+'_off'+'.png');
      }
    }
  }
    //VALVE XA
    for(let i = 0 ; i < value_valve_xa_thai.length ; i++ ){

        if(data_valve_xa_thai[i].toString() == "true"){
          value_valve_xa_thai[i].attr('src','assets/images/hmi/'+'valve_on'+'.png');
        } else {
          value_valve_xa_thai[i].attr('src','assets/images/hmi/'+'valve'+'_off'+'.png');
        }

    }
    //CB MUC
    // for(let i = 0 ; i < value_den_cam_bien.length ; i++ ){
    //   if(data_den_cam_bien[i].toString() == "true"){
    //     data_den_cam_bien[i].attr('src','assets/images/hmi/'+'cb'+'.png');
    //   } else {
    //     data_den_cam_bien[i].attr('src','assets/images/hmi/'+'cb'+'_off'+'.png');
    //   }
    // }
})
//#endregion READ DATA ATFER RELOAD
//#region BON LAM THOAANG 1500S
socket.on('message28',function(data){
  if(data[0].toString() == "true"){
    setTimeout(()=>{
      $('#lamthoang').attr('src','assets/images/hmi/'+'lamthoang'+'.png');
    },1500)
  } else {
    setTimeout(()=>{
      $('#lamthoang').attr('src','assets/images/hmi/'+'lamthoang_off'+'.png');
    },1500)
  }
})
//#endregion CLICK TAB
//#region VALVE 1
$('#valve_1_in').click(function(){
  name = "#" + $(this).attr('id').toString();
  $('#status_device').empty();
  $('#name_device').empty();
  $('#name_device_1').empty();
  if($(this).attr('src').toString().indexOf("_off") == -1){
    $('#status_device').append('ĐANG BẬT');
  } else {
    $('#status_device').append('ĐANG TẮT');
  }
  $('#name_device').append('valve_1_in');
  $('#name_device_1').append('BƠM 1');
  $('#nut_on').click(function(){
      $(`${name}`).attr('src','assets/images/hmi/'+'pumps_on'+'.png');
      if( $('#name_device').text().toString() == 'valve_1_in') {
        socket.emit('valve_1_in',{
          value: true,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + 'control_valve_1_in' + "\""
        })
      }

  })
  $('#nut_off').click(function(){
    $(`${name}`).attr('src','assets/images/hmi/'+'pumps'+'_off'+'.png');
    if( $('#name_device').text().toString() == 'valve_1_in') {
      socket.emit('valve_1_in',{
        value: false,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + 'control_valve_1_in' + "\""
      })
    }
    });
});
socket.on('message26'.toString(),function(data){
  if(data[0] == "true"){
    socket.emit('control_valve_1_in',{
      value: true,
      nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + 'control_valve_1_in' + "\""
    })
    $('#valve_1_in').attr('src','assets/images/hmi/'+'pumps_on'+'.png');
  } else {
    socket.emit('control_valve_1_in',{
          value: false,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + 'control_valve_1_in' + "\""
        })
    $('#valve_1_in').attr('src','assets/images/hmi/'+'pumps'+'_off'+'.png');
  }
})
//#endregion VALVE 1
//#region  MOTOR KHUAY
$('#dong_co').click(function(){
    name = "#" + $(this).attr('id').toString();
    $('#status_device').empty();
    $('#name_device').empty();
    $('#name_device_1').empty();
    if($(this).attr('src').toString().indexOf("_off") == -1){
      $('#status_device').append('ĐANG BẬT');
    } else {
      $('#status_device').append('ĐANG TẮT');
    }
    $('#name_device').append('ĐỘNG CƠ KHUẤY');
    $('#name_device_1').append('ĐỘNG CƠ KHUẤY');

      $('#nut_on').click(function(){
          $(`${name}`).attr('src','assets/images/hmi/'+'motor_khuay_on'+'.png');
          if( $('#name_device').text().toString() == 'ĐỘNG CƠ KHUẤY') {
            socket.emit('control_dong_co',{
              value: true,
              nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + 'control_dong_co' + "\""
            })
          }
      })
      $('#nut_off').click(function(){
          $(`${name}`).attr('src','assets/images/hmi/'+'motor_khuay'+'_off'+'.png');
          if( $('#name_device').text().toString() == 'ĐỘNG CƠ KHUẤY') {
            socket.emit('control_dong_co',{
              value: false,
              nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + 'control_dong_co' + "\""
            })
          }
      });

})
socket.on('message49',function(data){
  if(data[0] == "true"){
    socket.emit('control_dong_co',{
      value: true,
      nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + 'control_dong_co' + "\""
    })
    $('#dong_co').attr('src','assets/images/hmi/'+'motor_khuay_on'+'.png');
  } else {
    socket.emit('control_dong_co',{
      value: false,
      nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + 'control_dong_co' + "\""
    })
    $('#dong_co').attr('src','assets/images/hmi/'+'motor_khuay'+'_off'+'.png');
  }
})
//#endregion MOTOR KHUAY
//#region VALVE 2 den 7
function onoff1(param){
  $('#nut_on').click(function(){
    if(("control_"+param[0].attr('id').toString()) == $('#name_device').text().toString()){
      if($('#name_device').text().toString() == 'control_valve_3_in'){
        setTimeout(function(){
        $('#lamthoang').attr('src','assets/images/hmi/'+'lamthoang'+'.png');
      },1500)}
      socket.emit(param[1].toString(),{
        value: true,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param[1] + "\""
      })
    }
  })
  $('#nut_off').click(function(){
    if(("control_"+param[0].attr('id').toString()) == $('#name_device').text().toString()){
      if($('#name_device').text().toString() == 'control_valve_3_in'){
      setTimeout(function(){
      $('#lamthoang').attr('src','assets/images/hmi/'+'lamthoang'+'_off'+'.png');
      },1500)}
      socket.emit(param[1].toString(),{
        value: false,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param[1] + "\""
      })
    }
  });
}
var mang_valve = [
  [$('#valve_2_in'),
  'control_valve_2_in','BƠM 2'],
  [$('#valve_3_in'),
  'control_valve_3_in','BƠM 3'],
  [$('#valve_4_in'),
  'control_valve_4_in','BƠM 4'],
  [$('#valve_5_in'),
  'control_valve_5_in','BƠM 5'],
  [$('#valve_6_in'),
  'control_valve_6_in','BƠM 6'],
  [$('#valve_7_in'),
  'control_valve_7_in','BƠM 7'],
  [$('#valve_8_in'),
  'control_valve_8_in','BƠM 8'],
];
var message = [
  [$('#valve_2_in'),'message27'],
  [$('#valve_3_in'),'message28'],
  [$('#valve_4_in'),'message29'],
  [$('#valve_5_in'),'message30'],
  [$('#valve_6_in'),'message31'],
  [$('#valve_7_in'),'message32'],
  [$('#valve_8_in'),'message33'],
]

for (let i = 0 ; i < message.length ; i++ ){
  function listen_value_1(param,param1){
    socket.on(param[1].toString(),function(data){
      if(data[0].toString() == "true"){
        socket.emit(param1[1],{
          value: true,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param1[1] + "\""
        })
        param[0].attr('src','assets/images/hmi/'+'valve_pumps_on'+'.png');
      } else {
        socket.emit(param1[1],{
          value: false,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param1[1] + "\""
        })
        param[0].attr('src','assets/images/hmi/'+'valve_pumps'+'_off'+'.png');
      }
    })
  }
  listen_value_1(message[i],mang_valve[i])
} 
for(let i = 0 ; i < mang_valve.length ; i++){
  onoff1(mang_valve[i]);
  mang_valve[i][0].click(function(){
      name = "#" + $(this).attr('id').toString();
      $('#status_device').empty();
      $('#name_device').empty();
      $('#name_device_1').empty();
      if($(this).attr('src').toString().indexOf("_off") == -1){
        $('#status_device').append('ĐANG BẬT');
        console.log($('#status_device').text())
      } else {
        $('#status_device').append('ĐANG TẮT');
      }
      $('#name_device').append(mang_valve[i][1]);
      $('#name_device_1').append(mang_valve[i][2]);
      $('#nut_on').click(function(){
            $(`${name}`).attr('src','assets/images/hmi/'+'valve_pumps_on'+'.png');
      })
      $('#nut_off').click(function(){
          $(`${name}`).attr('src','assets/images/hmi/'+'valve_pumps'+'_off'+'.png');
      });
    })
}
//#endregion VALVE 2 den 7
//#region VALVE HOA CHAT
function onoff2(param){
  $('#nut_on').click(function(){
    if(("control_"+param[0].attr('id').toString()) == $('#name_device').text().toString()){
      socket.emit(param[1].toString(),{
        value: true,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param[1] + "\""
      })
    }
  })
  $('#nut_off').click(function(){
    if(("control_"+param[0].attr('id').toString()) == $('#name_device').text().toString()){
      socket.emit(param[1].toString(),{
        value: false,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param[1] + "\""
      })
    }
  });
}
var mang_valve_1 = [
  [$('#cuso4'),
  'control_cuso4','BƠM CUSO4'],
  [$('#naoh'),
  'control_naoh','BƠM NAOH'],
  [$('#pac'),
  'control_pac','BƠM PAC'],
  [$('#clo'),
  'control_clo','BƠM CLO']
];
var message_1 = [
  [$('#cuso4'),'message46'],
  [$('#naoh'),'message47'],
  [$('#pac'),'message48'],
  [$('#clo'),'message50']
]
for(let i = 0 ; i < mang_valve_1.length ; i++){
  onoff2(mang_valve_1[i]);
  mang_valve_1[i][0].click(function(){
      name = "#" + $(this).attr('id').toString();
      $('#status_device').empty();
      $('#name_device').empty();
      $('#name_device_1').empty();
      if($(this).attr('src').toString().indexOf("_off") == -1){
        $('#status_device').append('ĐANG BẬT');
      } else {
        $('#status_device').append('ĐANG TẮT');
      }
      $('#name_device').append(mang_valve_1[i][1]);
      $('#name_device_1').append(mang_valve_1[i][2]);
      $('#nut_on').click(function(){
            $(`${name}`).attr('src','assets/images/hmi/'+'valve_hoachat_on'+'.png');
      })
      $('#nut_off').click(function(){
          $(`${name}`).attr('src','assets/images/hmi/'+'valve_hoachat'+'_off'+'.png');
      });
    })
}
for (let i = 0 ; i < message_1.length ; i++ ){
  function listen_value_3(param,param1){
    socket.on(param[1].toString(),function(data){
      if(data[0] == "true"){
        socket.emit(param1[1],{
          value: true,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param1[1] + "\""
        })
        param[0].attr('src','assets/images/hmi/'+'valve_hoachat_on'+'.png');
      } else {
        socket.emit(param1[1],{
          value: false,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param1[1] + "\""
        })
        param[0].attr('src','assets/images/hmi/'+'valve_hoachat'+'_off'+'.png');
      }
    })
  }
  listen_value_3(message_1[i],mang_valve_1[i])
}
//#endregion VALE HOA CHAT
//#region VALVE XA 

function onoff3(param){
  $('#nut_on').click(function(){
    if(("control_"+param[0].attr('id').toString()) == $('#name_device').text().toString()){
      socket.emit(param[1].toString(),{
        value: true,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param[1] + "\""
      })
    }
  })
  $('#nut_off').click(function(){
    if(("control_"+param[0].attr('id').toString()) == $('#name_device').text().toString()){
      socket.emit(param[1].toString(),{
        value: false,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param[1] + "\""
      })
    }
  });
}
var mang_valve_2 = [
  [$('#valve_1_out'),
  'control_valve_1_out','BƠM XẢ 1'],
  [$('#valve_2_out'),
  'control_valve_2_out','BƠM XẢ 2'],
  [$('#valve_3_out'),
  'control_valve_3_out','BƠM XẢ 3'],
  [$('#valve_4_out'),
  'control_valve_4_out','BƠM XẢ 4'],
  [$('#valve_5_out'),
  'control_valve_5_out','BƠM XẢ 5'],
  [$('#valve_6_out'),
  'control_valve_6_out','BƠM XẢ 6'],
  [$('#valve_7_out'),
  'control_valve_7_out','BƠM XẢ 7'],
  [$('#bon_thai_1_out'),
  'control_bon_thai_1_out','XẢ BỒN CẶN 1'],
  [$('#bon_thai_2_out'),
  'control_bon_thai_2_out','XẢ BỒN CẶN 2']

];
var message_2 = [
  [$('#valve_1_out'),'message34'],
  [$('#valve_2_out'),'message35'],
  [$('#valve_3_out'),'message36'],
  [$('#valve_4_out'),'message37'],
  [$('#valve_5_out'),'message38'],
  [$('#valve_6_out'),'message39'],
  [$('#valve_7_out'),'message40'],
  [$('#bon_thai_1_out'),'message41'],
  [$('#bon_thai_2_out'),'message42'],
]
for(let i = 0 ; i < mang_valve_2.length ; i++){
  onoff3(mang_valve_2[i]);
  mang_valve_2[i][0].click(function(){
      name = "#" + $(this).attr('id').toString();
      $('#status_device').empty();
      $('#name_device').empty();
      $('#name_device_1').empty();
      if($(this).attr('src').toString().indexOf("_off") == -1){
        $('#status_device').append('ĐANG BẬT');
      } else {
        $('#status_device').append('ĐANG TẮT');
      }
      $('#name_device').append(mang_valve_2[i][1]);
      $('#name_device_1').append(mang_valve_2[i][2]);
      $('#nut_on').click(function(){
            $(`${name}`).attr('src','assets/images/hmi/'+'valve_xa_on'+'.png');
      })
      $('#nut_off').click(function(){
          $(`${name}`).attr('src','assets/images/hmi/'+'valve_xa'+'_off'+'.png');
      });
    })
}
for (let i = 0 ; i < message_2.length ; i++ ){
  function listen_value_4(param,param1){
    socket.on(param[1].toString(),function(data){
      if(data[0] == "true"){
        socket.emit(param1[1],{
          value: true,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param1[1] + "\""
        })
        param[0].attr('src','assets/images/hmi/'+'valve_xa_on'+'.png');
      } else {
        socket.emit(param1[1],{
          value: false,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param1[1] + "\""
        })
        param[0].attr('src','assets/images/hmi/'+'valve_xa'+'_off'+'.png');
      }
    })
  }
  listen_value_4(message_2[i],mang_valve_2[i])
}
//#endregion
//#region BANG DIEU KHIEN
$('#main_switch').click(function(){
  if($(this).attr('src') == 'assets/images/hmi/start.png'){
    $(this).attr('src','assets/images/hmi/stop'+'.png');
    socket.emit('start',{
      value: false,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'start/stop' + "\""
    })
  } else {
    $(this).attr('src','assets/images/hmi/start'+'.png');
    socket.emit('start',{
      value: true,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'start/stop' + "\""
    })
  }
})
$('#emergency').click(function(){
  if($(this).attr('src') == 'assets/images/hmi/emergency.png'){
    $(this).attr('src','assets/images/hmi/emergency_off'+'.png');
    socket.emit('emergency',{
      value: false,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'emergency' + "\""
    })
  } else {
    $(this).attr('src','assets/images/hmi/emergency'+'.png');
    socket.emit('emergency',{
      value: true,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'emergency' + "\""
    })
  }
})
$('#mode').click(function(){
  if($(this).attr('src') == 'assets/images/hmi/manu.png'){
    $(this).attr('src','assets/images/hmi/auto'+'.png');
    socket.emit('auto',{
      value: true,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'auto/manu' + "\""
    })
  } else {
    $(this).attr('src','assets/images/hmi/manu'+'.png');
    socket.emit('reset_control');
    socket.emit('auto',{
      value: false,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'auto/manu' + "\""
    })
  }
})
socket.on('message120',function(data){
  if(data[0].toString() == "true"){
    socket.emit('start',{
      value: true,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'start/stop' + "\""
    })
    $('#main_switch').attr('src','assets/images/hmi/'+'start'+'.png');
  } else {
    socket.emit('start',{
      value: false,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'start/stop' + "\""
    })
    $('#main_switch').attr('src','assets/images/hmi/'+'stop'+'.png');
  }
})
socket.on('message121',function(data){
  if(data[0].toString() == "true"){
    socket.emit('emergency',{
      value: true,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'emergency' + "\""
    })
    $('#emergency').attr('src','assets/images/hmi/'+'emergency'+'.png');
  } else {
    socket.emit('emergency',{
      value: false,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'emergency' + "\""
    })
    $('#emergency').attr('src','assets/images/hmi/'+'emergency'+'_off'+'.png');
  }
})
socket.on('message122',function(data){
  if(data[0].toString() == "true"){
    socket.emit('auto',{
      value: true,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'auto/manu' + "\""
    })
    $('#mode').attr('src','assets/images/hmi/'+'auto'+'.png');
  } else {
    socket.emit('reset_control');
    socket.emit('auto',{
      value: false,
      nodeid: "ns=1;s=\"CONTROL_SYSTEM\"." + "\"" + 'auto/manu' + "\""
    })
    $('#mode').attr('src','assets/images/hmi/'+'manu'+'.png');
  }
})
//#endregion BANG DIEU KHIEN
//#region CB MUC
var mang_valve_4 = [
  [$('#cb_max_bon_1'),'message79'],
  [$('#cb_max_bon_2'),'message80'],
  [$('#cb_max_bon_3'),'message81'],
  [$('#cb_max_bon_4'),'message82'],
  [$('#cb_max_bon_5'),'message83'],
  [$('#cb_max_bon_6'),'message84'],
  [$('#cb_max_bon_7'),'message85'],
  [$('#cb_min_bon_1'),'message86'],
  [$('#cb_min_bon_2'),'message87'],
  [$('#cb_min_bon_3'),'message88'],
  [$('#cb_min_bon_4'),'message89'],
  [$('#cb_min_bon_5'),'message90'],
  [$('#cb_min_bon_6'),'message91'],
  [$('#cb_min_bon_7'),'message92'],
  [$('#cb_muc_can_1'),'message93'],
  [$('#cb_muc_can_2'),'message94'],
]
function sensor(param){
  socket.on(param[1],function(data){
    if(data[0] == "true"){
      param[0].attr('src','assets/images/hmi/'+'cb'+'.png');
    } else {
      param[0].attr('src','assets/images/hmi/'+'cb_off'+'.png');
    }
  })
}
for(let i = 0; i < mang_valve_4.length; i++){
  sensor(mang_valve_4[i])
}
//#endregion CB MUC
//#region THIETBI LOI
function error(param){
  socket.on(param[1].toString(),function(data){
    
    if(data[0].toString() == "true"){
     
      param[0].css('display','block');
    } else {
      
      param[0].css('display','none');
    }
  })
}
for(let i = 0; i < mang_valve_5.length; i++){
  error(mang_valve_5[i])
}
//#endregion THIETBI LOI
//#region VALVE XA THAI
function onoff4(param){
  $('#nut_on').click(function(){
    if(("control_"+param[0].attr('id').toString()) == $('#name_device').text().toString()){
      socket.emit(param[1].toString(),{
        value: true,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param[1] + "\""
      })
    }
  })
  $('#nut_off').click(function(){
    if(("control_"+param[0].attr('id').toString()) == $('#name_device').text().toString()){
      socket.emit(param[1].toString(),{
        value: false,
        nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param[1] + "\""
      })
    }
  });
}
var mang_valve_3 = [
  [$('#xa_thai_1_in'),
  'control_xa_thai_1_in','XẢ THẢI 1'],
  [$('#xa_thai_2_in'),
  'control_xa_thai_2_in','XẢ THẢI 2'],
  [$('#xa_thai_3_in'),
  'control_xa_thai_3_in','XẢ THẢI 3'],
];
var message_3 = [
  [$('#xa_thai_1_in'),'message43'],
  [$('#xa_thai_2_in'),'message44'],
  [$('#xa_thai_3_in'),'message45'],

]
for(let i = 0 ; i < mang_valve_3.length ; i++){
  onoff4(mang_valve_3[i]);
  mang_valve_3[i][0].click(function(){
      name = "#" + $(this).attr('id').toString();
      $('#status_device').empty();
      $('#name_device').empty();
      $('#name_device_1').empty();
      if($(this).attr('src').toString().indexOf("_off") == -1){
        $('#status_device').append('ĐANG BẬT');
      } else {
        $('#status_device').append('ĐANG TẮT');
      }
      $('#name_device').append(mang_valve_3[i][1]);
      $('#name_device_1').append(mang_valve_3[i][2]);
      $('#nut_on').click(function(){
            $(`${name}`).attr('src','assets/images/hmi/'+'valve_on'+'.png');
      })
      $('#nut_off').click(function(){
          $(`${name}`).attr('src','assets/images/hmi/'+'valve'+'_off'+'.png');
      });
    })
}
for (let i = 0 ; i < message_3.length ; i++ ){
  function listen_value_5(param,param1){
    socket.on(param[1].toString(),function(data){
      if(data[0] == "true"){
        socket.emit(param1[1],{
          value: true,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param1[1] + "\""
        })
        param[0].attr('src','assets/images/hmi/'+'valve_on'+'.png');
      } else {
        socket.emit(param1[1],{
          value: false,
          nodeid: "ns=1;s=\"CONTROL_MANUAL\"." + "\"" + param1[1] + "\""
        })
        param[0].attr('src','assets/images/hmi/'+'valve'+'_off'+'.png');
      }
    })
  }
  listen_value_5(message_3[i],mang_valve_3[i])
}

socket.on('disconnect_1',()=>{
  alert('DISCONNECT FROM SERVER')
})
//#endregion
//#region SO LIEU HE THONG
for(let i = 0 ; i < mang_so_lieu.length ; i++ ){
    socket.on(mang_so_lieu[i][1],function(data){
      mang_so_lieu[i][0].html(`${data}`)
    })
}
//#endregion SO LIEU HE THONG
//#region JS HTML
document.querySelector('#set_up_dc').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    var value = $('#set_up_dc').val();
    if(parseFloat(value) >= 10){
      $('#thongbaonhap1').show(200);
    } else {
      $('#thongbaonhap1').hide();
      socket.emit('set_up_dc',{
        value: parseFloat(value),
        nodeid: "ns=1;s=\"SET_UP_MANUAL\"." + "\"" + 'set_up_dc' + "\""
      })
    }
  }
});
document.querySelector('#set_up_pumps').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    var value = $('#set_up_pumps').val();
    if(parseFloat(value) >= 10){
      $('#thongbaonhap2').show(200);
    } else {
    $('#thongbaonhap2').hide();
    socket.emit('set_up_pump_1',{
      value: parseFloat(value),
      nodeid: "ns=1;s=\"SET_UP_MANUAL\"." + "\"" + 'set_up_pump_1' + "\""
    })
  }
  }
});
$('#set_up_dc').click(()=>{
  $('#set_up_dc').val('')
})
$('#set_up_pumps').click(()=>{
  $('#set_up_pumps').val('')
})
   // Make the DIV element draggable:
   dragElement(document.getElementById("mydiv"));

   function dragElement(elmnt) {
     var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
     if (document.getElementById(elmnt.id + "header")) {
       // if present, the header is where you move the DIV from:
       document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
     } else {
       // otherwise, move the DIV from anywhere inside the DIV:
       elmnt.onmousedown = dragMouseDown;
     }

     function dragMouseDown(e) {
       e = e || window.event;
       e.preventDefault();
       // get the mouse cursor position at startup:
       pos3 = e.clientX;
       pos4 = e.clientY;
       document.onmouseup = closeDragElement;
       // call a function whenever the cursor moves:
       document.onmousemove = elementDrag;
     }

     function elementDrag(e) {
       e = e || window.event;
       e.preventDefault();
       // calculate the new cursor position:
       pos1 = pos3 - e.clientX;
       pos2 = pos4 - e.clientY;
       pos3 = e.clientX;
       pos4 = e.clientY;
       // set the element's new position:
       elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
       elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
     }

     function closeDragElement() {
       // stop moving when mouse button is released:
       document.onmouseup = null;
       document.onmousemove = null;
     }
   }
   $('#show_bangthongso').click(function(){
     $('#mydiv').toggle(500)
   })
   $('.fa-window-close').click(function(){
     $('#mydiv').hide(500)
   })
   var counter = 0;
   var c = 0;
   var i = setInterval(function(){
       $(".loading-page .counter h1").html(c + "%");
       $(".loading-page .counter hr").css("width", c + "%");
       //$(".loading-page .counter").css("background", "linear-gradient(to right, #f60d54 "+ c + "%,#0d0d0d "+ c + "%)"); 
     /*
     $(".loading-page .counter h1.color").css("width", c + "%");
     */
     counter++;
     c++;

     if(counter == 101) {
         clearInterval(i);
         $('#thongbaotaomoi1').css('display','none');
         $('.status').show(2000);
         $('#backg').show();
     }
   },35);
//#endregion JS HTML
})







