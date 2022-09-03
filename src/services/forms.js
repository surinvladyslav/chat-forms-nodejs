const forms = require("../database/models/forms");
const fetch = require("node-fetch");
const puppeteer = require('puppeteer');

const getForms = () => {
    return forms.find()
};

const addForms = (payload) => {
    return forms.create(payload);
};

const getFormsById = (id) => {
    return forms.findOne({_id: id})
};


const getFormsByFormId = (formId) => {
    return forms.findOne({formId})
};

const getFormsData = (formId, accessToken) => {
    return fetch(`https://forms.googleapis.com/v1/forms/${formId}`,{
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .catch(error => console.log(error))
};

const getId = (length = 8) => {
    return Math.random().toString(16).substr(2, length);
};


const getFormsImage = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'load',
        timeout: 0
    });

    const image = await page.$eval('.vnFTpb.teQAzf.ErmvL.KHCwJ', el => getComputedStyle(el).getPropertyValue('background-image'));
    await browser.close();

    return image.substring(5).slice(0, -2);
};

const updateForms = (formId, formData) => {
    return forms.updateOne({formId}, formData);
};

module.exports = {
    getForms,
    addForms,
    getFormsById,
    getFormsByFormId,
    getFormsImage,
    updateForms,
    getFormsData,
    getId
};
