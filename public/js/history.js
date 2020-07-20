var socket = io.connect();
$(document).ready(function () {
  var mang_data = [
    "valve_1_in",
    "valve_2_in",
    "valve_3_in",
    "valve_4_in",
    "valve_5_in",
    "valve_6_in",
    "valve_7_in",
    "valve_8_in",
    "valve_1_out",
    "valve_2_out",
    "valve_3_out",
    "valve_4_out",
    "valve_5_out",
    "valve_6_out",
    "valve_7_out",
    "thai_can_bon_1",
    "thai_can_bon_2",
    "xa_thai_1_in",
    "xa_thai_2_in",
    "xa_thai_3_in",
    "cuso4_bool",
    "naoh_bool",
    "pac_bool",
    "dong_co_bool",
    "clo",
    "valve_1_in_error",
    "valve_2_in_error",
    "valve_3_in_error",
    "valve_4_in_error",
    "valve_5_in_error",
    "valve_6_in_error",
    "valve_7_in_error",
    "valve_8_in_error",
    "valve_1_out_error",
    "valve_2_out_error",
    "valve_3_out_error",
    "valve_4_out_error",
    "valve_5_out_error",
    "valve_6_out_error",
    "valve_7_out_error",
    "thai_can_bon_1_error",
    "thai_can_bon_2_error",
    "xa_thai_1_in_error",
    "xa_thai_2_in_error",
    "xa_thai_3_in_error",
    "cuso4_error",
    "naoh_error",
    "pac_error",
    "dong_co_error",
    "clo_error",
    "start",
    "emergency",
    "auto",
  ];
  var array_socketevent = [];
  var array_socketemit = [];
  var array_socketon = [];
  for (let i = 1; i <= 53; i++) {
    array_socketon.push("emit" + i);
    array_socketemit.push(i);
    socket.on("emit" + i, (data) => {
      console.log(data);
      for (j = 0; j < data.length; j++) {
        $(`#${i}`).append(`
                <tr>
                    <th></th>
                    <th>${data[j].time}</th>
                    <th>${data[j].value}</th>
                <tr>
            `);
      }
    });
  }
  for (let i = 0; i < 53; i++) {
    array_socketevent.push(`message${[i + 26]}`);
    function socketon(item, i) {
      socket.on(item.toString(), (data) => {
        $(`#${[i + 1]}`).append(`
                    <tr>
                        <th></th>
                        <th>${data[1]}</th>
                        <th>${data[0]}</th>
                    <tr>
                `);
      });
    }
    socketon(array_socketevent[i], i);
  }
  var mang_hide = [];
  for (let i = 1; i < 53; i++) {
    mang_hide.push($(`#${i}`));
    $(`#${i}`).css("display", "none");
  }
  $("#change_mode").change(function () {
    $(`#${$("#change_mode").val().toString()}`).empty();
    socket.emit(
      $("#change_mode").val().toString(),
      mang_data[parseInt($("#change_mode").val() - 1)]
    );
    mang_hide.map((id_now, index) => {
      if (id_now !== $("#change_mode").val().toString()) {
        id_now.css("display", "none");
      }
    });
    $(`#${$("#change_mode").val().toString()}`).show(500);
  });
});
