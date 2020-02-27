
//Variable array that will be receiving all the information saved by the user 
var arraySavedNews = [];

if(localStorage.getItem("arraySavedNews") != null){
	arraySavedNews = JSON.parse(localStorage.getItem("arraySavedNews"));
}

//Variables that will receive the API's separated by each subject as required

$(document).ready(function() {
	var urlApiSport = 'http://newsapi.org/v2/everything?q=sport&apiKey=794274efe3f3444fad2eb50856af41c2';
	var urlBusiness = 'http://newsapi.org/v2/everything?q=business&apiKey=794274efe3f3444fad2eb50856af41c2';
	var urlFinancial = 'http://newsapi.org/v2/everything?q=financial&apiKey=794274efe3f3444fad2eb50856af41c2';

	//Function that adds datetime in home page
	nowDateTime();
	
	// Function that adds news into arrays 
	callRestApiNews('sport', urlApiSport);
	callRestApiNews('business', urlBusiness);
	callRestApiNews('financial', urlFinancial);
	setDataTable(arraySavedNews, 'saved');
	
	// clear news
	$("#clear").on("click", function(e) {
		localStorage.clear();
		arraySavedNews = [];
		refreshSavedNews();
	});
		
	// show or hide zone of the news - This one shows the home screen
	$(".back").on("click", function(e) {
		nowDateTime();
		$("#div-home").show();
		$("#div-sport").hide();
		$("#div-business").hide();
		$("#div-financial").hide();		
		$("#div-saved").hide();		
	});
	// show or hide zone of the news
	//This option will show all the sports section and hide the rest of the options
	$("#menu-sport").on("click", function(e) {
		$("#div-home").hide();
		$("#div-sport").show();
		$("#div-business").hide();
		$("#div-financial").hide();
		$("#div-saved").hide();		
	});
	// show or hide zone of the news
	//This option will show all the business section and hide the rest of the options
	$("#menu-business").on("click", function(e) {
		$("#div-home").hide();
		$("#div-sport").hide();
		$("#div-business").show();
		$("#div-financial").hide();
		$("#div-saved").hide();		
	});
	// show or hide zone of the news
	//This option will show all the financial section and hide the rest of the options
	$("#menu-financial").on("click", function(e) {
		$("#div-home").hide();
		$("#div-sport").hide();
		$("#div-business").hide();
		$("#div-financial").show();
		$("#div-saved").hide();		
	});

	// show or hide zone of the news
	//This option will show all the saved news and hide the rest of the options
	$("#menu-saved").on("click", function(e) {
		$("#div-home").hide();
		$("#div-sport").hide();
		$("#div-business").hide();
		$("#div-financial").hide();
		$("#div-saved").show();	
		refreshSavedNews();
		
	});
	
	//Creation of the parameters where variables was created to receive all the information
	//to be shown on the screen in order
	$(".btn-saved").on("click", function(e) {
		
		var selectedNews = $(this).attr("id");
		var tableSport = $('#dt-sport').DataTable().rows().data();
		var tableBusiness = $('#dt-business').DataTable().rows().data();
		var tableFinancial = $('#dt-financial').DataTable().rows().data();
		
		//(**)Function to manipulate information inside the variables created above. It will show the date and the news published
		//there is an if statement where the comparasion will be made if the user save the headline
		//and if is true, the information will be saved inside the array created to it.
		$.each(tableSport, function() {
				var dtPublished = this[0];
				var news = this[1];
				
				if(selectedNews == dtPublished){
					arraySavedNews.push([dtPublished, news, ""]);
				}
		});
		
		//(**)		
		$.each(tableBusiness, function() {
				var dtPublished = this[0];
				var news = this[1];
				
				if(selectedNews == dtPublished){
					arraySavedNews.push([dtPublished, news, ""]);
				}
		});
		
		//(**)		
		$.each(tableFinancial, function() {
				var dtPublished = this[0];
				var news = this[1];
				
				if(selectedNews == dtPublished){
					arraySavedNews.push([dtPublished, news, ""]);
				}
		});	
		
		localStorage.setItem("arraySavedNews", JSON.stringify(arraySavedNews));
	});
});

// Funtion to get the date and time from the system
function nowDateTime() {
	nowDate();
	nowTime();
}

// get date
function nowDate() {
	var monthNames = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
	var date = new Date();
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	$('#nowDate').html(day + "/" + monthNames[monthIndex] + "/" + year);	
}

// get time
function nowTime() {
	var pad = "0";
	var date = new Date();
	var minutes = date.getMinutes();
	var hour = date.getHours();
	$('#nowTime').html(hour + ":" + pad.substring(1, pad.length - minutes.length) + minutes);	
}



// call rest to get news from api
function callRestApiNews(suject, urlApi) {
	var url = urlApi;
	$.ajax({
		url : url,
		type : "GET",
		async : false, 
		success : (function(data, status, jqXhr) {
			var arrayOfNews = [];
			$.each(data.articles, function() {
				arrayOfNews.push([this.publishedAt, this.description, "<a class='btn-saved' id='"+this.publishedAt+"' href='#'><i class='fas fa-save'></i></a>"]);				
			});
			setDataTable(arrayOfNews, suject);			
		}) 
	});
}

// json to datatable
function setDataTable(arrayOfNews, suject) {
	$('#dt-' + suject).DataTable( {
		"searching": true,
		"info": true,
		"lengthChange": true,
		data: arrayOfNews,
		columns: [
			{ title: "Published" },
			{ title: "Text" },
			{ title: "Save" }
		]
	});	
}

// refresh datatable saved news
function refreshSavedNews() {
	$('#dt-saved').DataTable().destroy();
	setDataTable(arraySavedNews, 'saved');
	
}

