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
    const googleForm = await formsService.getFormsData(formId, accessToken);
    const formData = [];

    [
        'Hi',
        `Welcome to ${googleForm?.info?.title}`,
        `${googleForm?.info?.description}`,
    ].forEach((item) => {
        formData.push({
            title: item,
            itemId: getId(),
            type: 'simpleQuestion',
        })
    })

    formData.push({
        itemId: getId(),
        required: false,
        type: 'signQuestion',
    })

    googleForm?.items?.forEach((item, index) => {
        if(index === 1) {
            formData.push({
                title: `Question ${index+1} out of ${googleForm?.items?.length}`,
                itemId: getId(),
                type: 'simpleQuestion',
            })
        }

        if(index+1 === googleForm?.items?.length) {
            formData.push({
                title: 'Last question',
                itemId: getId(),
                type: 'simpleQuestion',
            })
        }

            formData.push({
            title: item.title,
            itemId: item.itemId,
            type: 'simpleQuestion',
        })

        if(item?.description) {
            formData.push({
                title: item?.description,
                itemId: getId(),
                type: 'simpleQuestion',
            })
        }

        if(item?.questionGroupItem) {
            item?.questionGroupItem?.questions.map((question) => {
                formData.push({
                    title: question?.rowQuestion?.title,
                    itemId: getId(),
                    type: 'simpleQuestion',
                })
                formData.push({
                    questions: item?.questionGroupItem?.grid?.columns?.options?.map((option) => ({
                        ...option,
                        questionId: getId(),
                        checked: false,
                    })),
                    questionsType: item?.questionGroupItem?.grid?.columns?.type,
                    itemId: question?.questionId,
                    required: !question?.required,
                    type: 'choiceQuestion',
                })
            })
            return;
        }

        if(item?.questionItem?.question?.choiceQuestion) {
            formData.push({
                itemId: item?.questionItem?.question?.questionId,
                required: !item?.questionItem?.question?.required,
                questions: item?.questionItem?.question?.choiceQuestion?.options?.map((option) => ({
                    ...option,
                    questionId: getId(),
                    checked: false,
                })),
                questionsType: item?.questionItem?.question?.choiceQuestion?.type,
                type: 'choiceQuestion',
            })
        }

        if(item?.questionItem?.question?.scaleQuestion) {
            formData.push({
                title: `${item?.questionItem?.question?.scaleQuestion?.low} ${item?.questionItem?.question?.scaleQuestion?.lowLabel}`,
                itemId: getId(),
                type: 'simpleQuestion',
            })
            formData.push({
                title: `${item?.questionItem?.question?.scaleQuestion?.high} ${item?.questionItem?.question?.scaleQuestion?.highLabel}`,
                itemId: getId(),
                type: 'simpleQuestion',
            })
            formData.push({
                itemId: item?.questionItem?.question?.questionId,
                required: !item?.questionItem?.question?.required,
                options: {
                    ...item?.questionItem?.question?.scaleQuestion
                },
                type: 'scaleQuestion',
            })
        }

        if(item?.questionItem?.question?.textQuestion) {
            formData.push({
                itemId: item?.questionItem?.question?.questionId,
                required: !item?.questionItem?.question?.required,
                type: 'textQuestion',
            })
        }

        if(item?.questionItem?.question?.dateQuestion) {
            formData.push({
                itemId: item?.questionItem?.question?.questionId,
                required: !item?.questionItem?.question?.required,
                options: {
                    ...item?.questionItem?.question?.dateQuestion
                },
                type: 'dateQuestion',
            })
        }

        if(item?.questionItem?.question?.timeQuestion) {
            formData.push({
                itemId: item?.questionItem?.question?.questionId,
                required: !item?.questionItem?.question?.required,
                options: {
                    ...item?.questionItem?.question?.timeQuestion
                },
                type: 'timeQuestion',
            })
        }
    })

    formData.push({
        itemId: getId(),
        required: false,
        type: 'submitQuestion',
    })

    formData.push({
        title: 'Thank you!',
        itemId: getId(),
        type: 'simpleQuestion',
    })

    // const imageUri = await formsService.getFormsImage(formData?.responderUri);

    if (forms) {
        await formsService.updateForms(formId, {...googleForm, items: formData});
        return res.status(httpStatus.CREATED).json(forms.id);
    }

    // imageUri: imageUri
    const newForms = await formsService.addForms({...googleForm, items: formData});
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