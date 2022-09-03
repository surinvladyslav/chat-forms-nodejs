const httpStatus = require("http-status");
const { formsService } = require('../services');
const catchError = require("../utils/catchError");
const AppError = require("../utils/appError");
const {getId} = require("../services/forms");

const getForms = catchError(async (req, res) => {
    const posts = await formsService.getForms();
    return res.status(httpStatus.OK).json(posts);
});

const addForms = catchError(async (req, res) => {
    const { formId, accessToken } = req.body;

    if (!formId && !accessToken) {
        throw new AppError(400,`formId or accessToken not valid`);
    }

    const forms = await formsService.getFormsByFormId(formId);
    const formData = await formsService.getFormsData(formId, accessToken);
    const data = [];

    for (const item of formData.items) {
        if(item?.questionGroupItem) {
            item?.questionGroupItem?.questions.map((question) => {
                data.push({
                    itemId: getId(),
                    title: question?.rowQuestion?.title,
                    questionItem: {
                        question: {
                            choiceQuestion: {
                                options: item?.questionGroupItem?.grid?.columns?.options?.map((option) => ({
                                    ...option,
                                    itemId: getId(),
                                    checked: false,
                                })),
                                type: item?.questionGroupItem?.grid?.columns?.type
                            }
                        },
                        questionId: question?.questionId,
                        required: question?.required
                    }
                })
            })
        }

        if(item?.questionItem?.question?.choiceQuestion) {
            data.push({
                ...item,
                questionItem: {
                    question: {
                        choiceQuestion: {
                            ...item?.questionItem?.question?.choiceQuestion,
                            options: item?.questionItem?.question?.choiceQuestion?.options?.map((option) => ({
                                ...option,
                                itemId: getId(),
                                checked: false,
                            })),
                        }
                    },
                }
            })
        }

        if(!item?.questionGroupItem) {
            data.push(item)
        }
    }

    // const imageUri = await formsService.getFormsImage(formData?.responderUri);

    if (forms) {
        await formsService.updateForms(formId, {...formData, items: data});
        return res.status(httpStatus.CREATED).json(forms.id);
    }

    // imageUri: imageUri
    const newForms = await formsService.addForms({...formData, items: data});
    return res.status(httpStatus.CREATED).json(newForms.id);
});

const getFormsById = catchError(async (req, res) => {
    const forms = await formsService.getFormsById(req.params.id);
    if (!forms) {
        throw new AppError(400,`${req.params.id} id not found`)
    }
    return res.status(httpStatus.OK).json(forms);
});

module.exports = {
    getForms,
    addForms,
    getFormsById,
};
