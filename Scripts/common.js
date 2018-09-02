﻿var textAreaValueUpdating = false;
var textAreaValueChanged = false;

$(function(){
  $("#all-countries").on('change', function(){
    if($(this).is(":checked")) {
      showValues(AllCountries);
    }
  });
  $("#all-states").on('change', function(){
    if($(this).is(":checked")){
      showValues(AllStates);      
    }
  });
  $("#other").on('change', function(){
    if($(this).is(":checked")) {
      showValues(null); 
    }
  });
  
  $(".start-btn").click(draw);
  
  $(".values").tooltip({
    trigger: "manual",
    placement: "right"
  });
  $(".values").on("change input", function(){
    textAreaValueChanged = true;
    updateFilterAndIndicator(!textAreaValueUpdating);
  });  
  $(".values").on("focusout", function(){
    if(textAreaValueChanged) {
      textAreaValueChanged = false;
      updateFilterAndIndicator();
    }
  });

  createNumberOfGroupsOptions();
  initSelect2();
  showValues(AllCountries);
});

function updateFilterAndIndicator(indicatorOnly) {
  var distinctValues = getDistinctValues();
    
  if(distinctValues.length == 0) {
    if(!indicatorOnly) {
      setFilter(null);
    }
    $(".lines-count").text("");
  } else {    
    if(!indicatorOnly) {
      setFilter(distinctValues);
    }
    $(".lines-count").text("(" + distinctValues.length + ") ");
  }
}

function initSelect2(){
  $(".multiselect").select2({
    language: "ru",
    width: "300px",
    allowClear: true,
    multiple: true,
    closeOnSelect: false,
    dropdownCssClass: "multiselect-dropdown",
    placeholder: "Все"
  }).on("select2:close", function () { 
    if($(this).val().length > 0) {
      $(".values").prop("readonly", true);
    } else {
      $(".values").prop("readonly", false);
    }
    updateFilterAndIndicator(true);
  });
}

function createNumberOfGroupsOptions() {
  var i = 1;
  
  while(i++ < 11) {
    $(".number-of-groups").append($("<option value='" + i + "'" + (i == 4 ? "selected" : "") + ">" + i + " штук" + (i > 4 ? "" : "и") + "</option>"))
  }
}

function setFilter(distinctValues) {
  $(".items-select option:not(.all-option)").remove();
  
  if(distinctValues != null) {
    var html = "";
    $.each(distinctValues, function(index, value) {
      html += "<option value='" + value + "'>" + value + "</option>";
    });

    $(".items-select").append($(html));
  }
}

function getDistinctValues() {
  return $(".values").prop("readonly") 
    ? $(".multiselect").val()
    : distinct(
        $(".values")
          .val()
          .split(/\r|\r\n|\n/)
          .filter(function(s){ return s.replace(/\s/g, "") !== ""; }));
}

function showValues(values){
  textAreaValueUpdating = true;
  
  var textArea = $(".values");
  
  textArea.prop("readonly", false);
  if(values == null){
    textArea.val("").change();
    textArea.tooltip("show");
  } else {
    textArea.val(values.join("\n")).change();
    textArea.tooltip("hide");
  }
  
  textAreaValueUpdating = false;
}

function draw() {
  var distinctValues = getDistinctValues();
  var groupSize = parseInt($(".number-of-groups").val());
  var resultsDiv = $(".results");
  
  shuffle(distinctValues);
  var groups = split(distinctValues, groupSize);
  resultsDiv.html("");
  
  var i, j;
  for (i = 0; i < groups.length; i++) {
    var html = "<div class='result-group col'><ul class='list-group'>";
    for (j = 0; j < groups[i].length; j++) {
      html += "<li class='list-group-item'>" + groups[i][j] + "</li>";
    }
    html += "</ul></div>";
    resultsDiv.append($(html));
  }
}

function shuffle(values) {
	var i, temp, j;
	var count = values.length
  
  for (i = 0; i < count; i++) {
		j = ~~(Math.random() * count);
		temp = values[i];
		values[i] = values[j];
		values[j] = temp;
	}
	
  return values;
}

function split(values, groupSize){
    var result = [];
    
    while (values.length) {
        result.push(values.splice(0, groupSize));
    }
  
    if(result.length > 1 
       && $(".concat-remainder").is(":checked")
       && result[result.length - 1].length < groupSize) {
      result[result.length - 2] = result[result.length - 2].concat(result[result.length - 1]);
      result.pop();
    }
    
    return result;
}

function distinct(values) {
  var distinctValues = [];
  $.each(values, function(index, value) {
    var trimmedValue = $.trim(value);
    if ($.inArray(trimmedValue, distinctValues) == -1) {
      distinctValues.push(trimmedValue);
    }
  });
  return distinctValues;
}

const AllStates = [
"Айдахо",
"Айова",
"Алабама",
"Аляска",
"Аризона",
"Арканзас",
"Вайоминг",
"Вашингтон",
"Вермонт",
"Вирджиния",
"Висконсин",
"Гавайи",
"Делавэр",
"Джорджия",
"Западная Вирджиния",
"Иллинойс",
"Индиана",
"Калифорния",
"Канзас",
"Кентукки",
"Колорадо",
"Коннектикут",
"Луизиана",
"Массачусетс",
"Миннесота",
"Миссисипи",
"Миссури",
"Мичиган",
"Монтана",
"Мэн",
"Мэриленд",
"Небраска",
"Невада",
"Нью-Гэмпшир",
"Нью-Джерси",
"Нью-Йорк",
"Нью-Мексико",
"Огайо",
"Оклахома",
"Орегон",
"Пенсильвания",
"Род-Айленд",
"Северная Дакота",
"Северная Каролина",
"Теннесси",
"Техас",
"Флорида",
"Южная Дакота",
"Южная Каролина",
"Юта"
];

const AllCountries = [
"Афганистан",
"Австралия",
"Австрия",
"Азербайджан",
"Албания",
"Алжир",
"Ангола",
"Андорра",
"Антигуа и Барбуда",
"Аргентина",
"Армения",
"Багамы",
"Бангладеш",
"Барбадос",
"Бахрейн",
"Белиз",
"Белоруссия",
"Бельгия",
"Бенин",
"Бирма/Мьянма",
"Болгария",
"Боливия",
"Босния и Герцеговина",
"Ботсвана",
"Бразилия",
"Бруней",
"Буркина-Фасо",
"Бурунди",
"Бутан",
"Вануату",
"Ватикан",
"Венгрия",
"Венесуэла",
"Восточный Тимор",
"Вьетнам",
"Габон",
"Гаити",
"Гайана",
"Гамбия",
"Гана",
"Гватемала",
"Гвинея",
"Гвинея-Бисау",
"Германия",
"Гондурас",
"Гренада",
"Греция",
"Дания",
"Джибути",
"Джорджия",
"Доминика",
"Доминиканская Республика",
"Египет",
"Замбия",
"Западная Сахара",
"Зимбабве",
"Израиль",
"Индия",
"Индонезия",
"Иордания",
"Ирак",
"Иран",
"Ирландия",
"Исландия",
"Испания",
"Италия",
"Йемен",
"Кабо-Верде",
"Казахстан",
"Камбоджа",
"Камерун",
"Канада",
"Катар",
"Кения",
"Кипр",
"Кирибати",
"Китай",
"Колумбия",
"Коморские острова",
"Конго",
"Конго, демократическая республика",
"Корея, север",
"Корея, юг",
"Коста-Рика",
"Кот-д'Ивуар / Кот-д'Ивуар",
"Куба",
"Кувейт",
"Кыргызстан",
"Лаос",
"Латвия",
"Лесото",
"Либерия",
"Ливан",
"Ливия",
"Литва",
"Лихтенштейн",
"Люксембург",
"Маврикий",
"Мавритания",
"Мадагаскар",
"Македония",
"Малави",
"Малайзия",
"Мали",
"Мальдивы",
"Мальта",
"Марокко",
"Маршалловы Острова",
"Мексика",
"Микронезия",
"Мозамбик",
"Молдова",
"Монако",
"Монголия",
"Намибия",
"Науру",
"Непал",
"Нигер",
"Нигерия",
"Нидерланды",
"Никарагуа",
"Новая Зеландия",
"Норвегия",
"Объединенные Арабские Эмираты",
"Оман",
"Пакистан",
"Палау",
"Палестина",
"Панама",
"Папуа - Новая Гвинея",
"Парагвай",
"Перу",
"Польша",
"Португалия",
"Российская Федерация",
"Руанда",
"Румыния",
"Сальвадор",
"Самоа",
"Сан-Марино",
"Сан-Томе и Принсипи",
"Саудовская Аравия",
"Свазиленд",
"Сейшельские острова",
"Сенегал",
"Сент-Винсент и Гренадины",
"Сент-Китс и Невис",
"Сент-Люсия",
"Сербия",
"Сингапур",
"Сирия",
"Словакия",
"Словения",
"Соединенное Королевство",
"Соединенные Штаты",
"Соломоновы Острова",
"Сомали",
"Судан",
"Суринам",
"Сьерра-Леоне",
"Таджикистан",
"Таиланд",
"Танзания",
"Того",
"Тонга",
"Тринидад и Тобаго",
"Тувалу",
"Тунис",
"Туркмения",
"Турция",
"Уганда",
"Узбекистан",
"Украина",
"Уругвай",
"Фиджи",
"Филиппины",
"Финляндия",
"Франция",
"Хорватия",
"Центральноафриканская Республика",
"Чад",
"Черногория",
"Чешская Республика",
"Чили",
"Швейцария",
"Швеция",
"Шри-Ланка",
"Эквадор",
"Экваториальная Гвинея",
"Эритрея",
"Эстония",
"Эфиопия",
"Южная Африка",
"Южный Судан",
"Ямайка",
"Япония"
];