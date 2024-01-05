"use strict";

// інфо про компанію
var company = {
  site: 'https://site-name',
  brand: 'brand',
  company: 'company name LTD.',
  address: 'company address company address company address company address company address company address'
};
$('.company-site').html(company.site);
$('.company-brand').html(company.brand);
$('.company-name').html(company.company);
$('.company-address').html(company.address);