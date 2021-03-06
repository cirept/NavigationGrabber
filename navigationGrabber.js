/* global document */

/**
 *
 *   dealer.com navigation scraper
 *   author: cire
 *
 */


//function setSubMenu(navigationMenu, subNavArray) {
//    'use strict';
//
//
//}

/**
 *  accepts the main navigation menu
 *  @param {object} navigationMenu - the object that will contain the navigation menu structure
 *  @param {array} mainNavArray - the MAIN navigation UL element
 */
function setMainNavItems(navigationMenu, mainNavArray) {
    'use strict';

    /**
     *   build navigation object
     */
    for (let z = 0; z < mainNavArray.length; z += 1) {
        let subMenuLinks = {};
        let mainMenuText; // = mainNavArray[z].innerText.trim() === '' ? 'image' : mainNavArray[z].innerText; // get main navigation menu item text
        let subMenu = mainNavArray[z].querySelector('ul'); // save all the sub menus that appear in the drop down
        // let subLinkInfo = {};
        let linkText; // = subLinks[a].innerText.trim();
        let linkURL; // = subLinks[a].querySelector('a').href;
        if (subMenu) { // check to see if the main navigation item has a sub menu
            mainMenuText = subMenu.parentElement.firstElementChild.innerText; // Will always be the first element in the LI element (usually)
            let subLinks = subMenu.querySelectorAll('li'); // get links in the sub menu

            // loop through sub menu links and get all links information
            for (let a = 0; a < subLinks.length; a += 1) {
                linkText = subLinks[a].innerText.trim();
                linkURL = subLinks[a].querySelector('a').href;
                // save sub menu link information in sub menu object
                subMenuLinks[linkText] = linkURL;
            }
        } else {
            // if there is no sub menu that means that the main navigation text is a link
            let mainNavLink = mainNavArray[z].querySelector('a');

            mainMenuText = mainNavLink.innerText;
            linkURL = mainNavLink.href;

            // save sub menu link information in sub menu object
            subMenuLinks[mainMenuText] = linkURL;
        }
        // save sub menu object
        navigationMenu[mainMenuText] = subMenuLinks;
    }
}

function ddc() {
    'use strict';

    let mainNavigation = document.querySelector('ul.navbar-nav');
    let navigationMenu = {};
    // save the drop down menu links
    navigationMenu.provider = 'ddc';

    /**
     *   build navigation object
     */
    let mainNavigationItems = mainNavigation.children; // save all the DROP DOWN MENU that appears when clicking on a main navigation item
    // setMainNavItems(navigationMenu, mainNavigationItems);
    // let mainNavigationItems = mainNavigation.children; // save all the DROP DOWN MENU that appears when clicking on a main navigation item
    for (let z = 0; z < mainNavigationItems.length; z += 1) {
        let subMenu = {};
        let mainMenuText = mainNavigationItems[z].innerText.trim() === '' ? 'image' : mainNavigationItems[z].innerText; // get get main navigation menu item text

        /**
         *   Build drop down menu that appears after clicking the main navigation item
         */
        let title = mainNavigationItems[z].querySelectorAll('ul.nav-links'); // save all the sub menus that appear in the drop down
        for (let u = 0; u < title.length; u += 1) {
            let subMenuLinks = {};
            let subMenuTitle = title[u].parentElement.firstElementChild.innerText; // get sub menu title

            /**
             *   Loop Through sub menus and get all links information
             */
            let subLinks = title[u].querySelectorAll('li'); // get links in the sub menu
            for (let a = 0; a < subLinks.length; a += 1) {
                let subLinkInfo = {};
                let linkText = subLinks[a].innerText.trim();
                let linkURL = subLinks[a].querySelector('a').href;

                // save data into array
                subLinkInfo.Text = linkText;
                subLinkInfo.URL = linkURL;
                // save sub menu link information in sub menu object
                subMenuLinks[a] = subLinkInfo;
            }
            // save sub menu object
            subMenu[subMenuTitle] = subMenuLinks;
        }
        // save the drop down menu links
        navigationMenu[mainMenuText] = subMenu;
    }
    // console.log(navigationMenu);
    return navigationMenu;
}

function cdk() {
    'use strict';

    let mainNavigation = document.querySelector('nav > ul');
    let navigationMenu = {};
    // save the drop down menu links
    navigationMenu.provider = 'cdk';

    let mainNavigationItems = mainNavigation.children; // save all the DROP DOWN MENU that appears when clicking on a main navigation item
    setMainNavItems(navigationMenu, mainNavigationItems);
    //    console.log(navigationMenu);
    return navigationMenu;
}

function csvConvertor(JSONData, ReportTitle) {
    'use strict';

    // If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    let CSV = '';
    // column titles
    let columnTitles = ['Main Nav Title', 'Sub-Nav Drop Down Title', 'Live Link Text', 'Live URL reference', 'CDK Proof URL', 'LandingPage Name'];

    // Set Report title in first row or line
    CSV += ReportTitle + '\r\n\n';

    // will generate the Label/Header
    CSV += columnTitles.join() + '\r\n\n';

    // This loop will extract the label from 1st index of on array
    for (let menu in arrData) {
        if (arrData.hasOwnProperty(menu)) {
            // skip provider key
            if (menu.indexOf('provider') > -1) {
                continue;
            }
            // build sub menu
            for (let subMenu in arrData[menu]) {
                if (arrData[menu].hasOwnProperty(subMenu)) {
                    let row = '';
                    row += menu + ',';
                    row += subMenu;
                    CSV += row + '\r\n';
                    // add sub menu links to CSV
                    for (let info in arrData[menu][subMenu]) {
                        if (arrData[menu][subMenu].hasOwnProperty(info)) {
                            let newRow = ' , , ' + arrData[menu][subMenu][info].Text + ',' + arrData[menu][subMenu][info].URL;
                            CSV += newRow + '\r\n';
                        }
                    }
                }
            }
        }
    }

    // if there is something wrong with the CSV, return an error
    if (CSV === '') {
        // alert('Invalid data');
        return;
    }

    // Initialize file format you want csv or xls
    let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    return uri;
}

function csvConvertorCDK(JSONData, ReportTitle) {
    'use strict';

    // If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    let CSV = '';
    // column titles
    let columnTitles = ['Main Nav Title', 'Sub-Nav Drop Down Title', 'CDK Link', 'Content URL Reference', 'Build and Styling Notes', 'LandingPage Proof URL', 'LandingPage Name'];

    // Set Report title in first row or line
    CSV += ReportTitle + '\r\n\n';

    // will generate the Label/Header
    CSV += columnTitles.join() + '\r\n\n';
    //    debugger;
    // This loop will extract the label from 1st index of on array
    for (let menu in arrData) {
        if (arrData.hasOwnProperty(menu)) {
            // skip provider key
            if (menu.indexOf('provider') > -1) {
                continue;
            }
            // build sub menu
            let length = Object.keys(arrData[menu]).length;
            let counter = 1;
            let row = '';
            // if first
            if (counter === 1) {
                row += menu;
                CSV += row + '\r\n';
            }

            // add sub menu links to CSV
            for (let info in arrData[menu]) {
                if (arrData[menu].hasOwnProperty(info)) {
                    let newRow;
                    // check if the URL leads to a model details page
                    if (arrData[menu][info].indexOf('/models/') > -1) {
                        newRow = ' , ' + info + ',' + arrData[menu][info].substr(arrData[menu][info].indexOf('/models/') + 1);
                    } else {
                        newRow = ' , ' + info + ',' + arrData[menu][info].substr(arrData[menu][info].lastIndexOf('/') + 1);
                    }
                    //                    let newRow = ' , ' + info + ',' + arrData[menu][info].substr(arrData[menu][info].lastIndexOf('/') + 1);
                    if (counter === length) {
                        CSV += newRow + '\r\n\n';
                    } else {
                        CSV += newRow + '\r\n';
                    }
                }
                counter += 1;
            }
        }
    }

    // if there is something wrong with the CSV, return an error
    if (CSV === '') {
        alert('Invalid data');
        return;
    }

    // Initialize file format you want csv or xls
    let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    //    console.log(uri);
    return uri;
}

function addLink() {
    'use strict';

    if (this.value.indexOf('Choose Option') > -1) {
        return;
    }
    let navObj;
    let linkContainer = document.createElement('div');
    document.getElementById('navToolContainer').appendChild(linkContainer);

    // create text link
    let myLink = document.createElement('a');
    myLink.download = 'myNavigation.csv';
    myLink.innerText = '"Save link as..." to download the navigation csv';
    linkContainer.appendChild(myLink);

    // console.log(this.value);
    switch (this.value) {
        case 'ddc':
            navObj = ddc();
            myLink.href = csvConvertor(navObj, 'Navigation');
            break;
        case 'cdk':
            navObj = cdk();
            myLink.href = csvConvertorCDK(navObj, 'Navigation');
            break;
        default:
            // do nothing
    }
    // let navObj = getNavigation(this.value);
}

function addDropDown() {
    'use strict';

    let dropdownContainer = document.createElement('div');
    dropdownContainer.id = 'navToolContainer';
    dropdownContainer.style.position = 'fixed';
    dropdownContainer.style.top = '0px';
    dropdownContainer.style.left = '25%';
    dropdownContainer.style.zIndex = '9999999';
    dropdownContainer.style.padding = '5px';
    dropdownContainer.style.background = '#ffffff';
    dropdownContainer.innerText = 'grabNav v.0.2';
    dropdownContainer.style.cssText = dropdownContainer.style.cssText + 'background: linear-gradient(to bottom, #b2fefa, #0ed2f7) !important;'; // adding !important
    document.body.appendChild(dropdownContainer);

    // create dropdown selection
    let myDropdown = document.createElement('select');
    myDropdown.id = 'myNavTool';
    myDropdown.onchange = addLink;
    myDropdown.style.height = '50px';
    myDropdown.style.display = 'block';
    myDropdown.style.width = 'auto';
    myDropdown.style.padding = '10px';
    myDropdown.style.color = '#000000';
    myDropdown.style.border = '5px solid rgb(255, 255, 255)';
    myDropdown.style.borderRadius = '10px';
    myDropdown.style.cssText = myDropdown.style.cssText + 'background: linear-gradient(to top, rgb(86, 171, 47), rgb(168, 224, 99)) !important;'; // adding !important
    dropdownContainer.appendChild(myDropdown);

    /**
     *   create options for the dropdown selection
     */
    let myOptions = ['Choose Option', 'ddc', 'cdk'];
    for (let y = 0; y < myOptions.length; y += 1) {
        let option = document.createElement('option');
        option.value = myOptions[y];
        option.text = myOptions[y];
        myDropdown.appendChild(option);
    }
}

addDropDown();
// cdk();
// csvConvertorCDK(cdk(), 'Navigation');
