'use strict';

var $zipCode = $('#zipCode').val(localStorage.getItem('zip'))
var BASE     = 'http://tvlistings.timewarnercable.com'

$(".alert").alert()
$('.error, #clearCache').hide()

var $searchBtn = $('#searchBtn').click(function(){
	var zipVal = $zipCode.val()
	if ( zipVal ) {
		var searchBtn = $(this).button('loading')
		$.get(BASE +'/findTvListings/?zipCode='+ zipVal).done(function(data){
			var elements = parseLineups(data)
			if (elements.length) {
				localStorage.clear()
				localStorage.setItem('lineup', BASE + elements[0].getAttribute('href'))
				searchBtn.button('complete').attr('disable', true)
			} else {
				onFailure('No TWC channel lineups for this area.')
				searchBtn.button('reset')
			}
			updateCacheBtn()
		}).fail(onFailure)
	} else {
		$zipCode.focus()
	}
})

var $clearCacheBtn = $('#clearCache')

updateCacheBtn()

$clearCacheBtn.click(function(){
	localStorage.removeItem('cache')
	updateCacheBtn()
})

function updateCacheBtn() {
	if (localStorage.getItem('cache')) {
		$clearCacheBtn.show()
	} else {
		$clearCacheBtn.hide()
	}
}

function parseLineups(data) {
	var template = document.createElement('template')
	template.innerHTML = data
	return template.content.querySelectorAll('a.arrowBtn:first-child')
}

function onFailure (data) {
	console.error(data)
	$('.error').find('.msg').text(data).end().fadeIn()
}
