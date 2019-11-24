
function get_roc_id(){
	var roc_id=null;
	$.ajax({
		type : "GET",
		async: 0,
		contentType: "application/json;charset=UTF-8",
		url : "http://wsxy.chinaunicom.cn/api/learner/play/course/49146587/outline",
		data : null,
		success : function(resp) {
			roc_id=resp[1].id;
			console.debug('roc_id=',roc_id);
		}
	});
	return roc_id+'';
};


function get_sessionTime(){
	var sessionTime=null;
	var courseDetailId=location.href.split('courseDetailId=')[1].split(';')[0];
	$.ajax({
		type : "GET",
		async: 0,
		contentType: "application/json;charset=UTF-8",
		url : "http://wsxy.chinaunicom.cn/api/learner/offering-courses/"+courseDetailId,
		data : null,
		success : function(resp) {
			sessionTime=resp.duration;
			console.debug('sessionTime=',sessionTime);
		}
	});
	sessionTime=parseInt(sessionTime)+1;
	var h=(Array(2).join('0') + Math.floor(sessionTime/60)).slice(-2);
	var m=(Array(2).join('0') + Math.ceil(sessionTime%60)).slice(-2); 
	return h+':'+m+':'+'00';
};

function get_points(course_id){
	if(!course_id){return};
	course_id=course_id+'';
	var msg='';
	$.ajax({
		type : "POST",
		async: 0,
		contentType: "application/json;charset=UTF-8",
		url : "http://wsxy.chinaunicom.cn/api/learner/unicom/points/add/courese/"+course_id,
		data : null,
		success : function(resp) {
			console.debug('resp=',resp);
			msg='课程完成，金币领取成功';
		},
		error : function(resp){
			msg=resp.responseJSON.message;
			console.debug('resp', msg);
		}
	});
	return msg;
};

function save_my_course(){
	var t=location.href.split(';');
	var formdata=new FormData();
	var course_id=t[0].split('course/')[1];
	var status=null;
	formdata.append("rawStatus", "complete");
	formdata.append("credit", "no-credit");
	formdata.append("course.id", course_id);
	formdata.append("classroom.id", t[1].split('classroomId=')[1]);
	formdata.append("rco.id", get_roc_id());
	formdata.append("sessionTime", get_sessionTime());
	formdata.append("terminalType", "PC");
	$.ajax({
		type: "POST",
		url:"http://wsxy.chinaunicom.cn/api/learner/play/course/"+course_id+"/save",
		data:formdata,
		async: 0,
		contentType: false,
		processData: false,
		success: function(resp) {
			if(resp){
				status=resp[1].status;
				console.debug('status=',status);
			}
		}
	});
	if(status){
		return course_id;
	}else{return null;}
};


function offering(){
	var course_id=save_my_course();
	if(course_id){
		var msg=get_points(course_id);
		alert(msg);
	}
};

function sdbinit(){
	var btn=document.querySelector('body > spk-root > spk-player > div > div.player-content.clearfix > div.save-logout.ng-tns-c39-3 > button');	
	var sp=document.querySelector('body > spk-root > spk-player > div > div.player-content.clearfix > div.save-logout.ng-tns-c39-3 > button > span');
	btn.onclick=offering;
	sp.innerText='一键结课';
}
sdbinit();