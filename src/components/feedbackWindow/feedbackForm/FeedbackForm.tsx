import { useEffect, useState } from 'react';
import { LeftBack } from "../../../assets/svg/LeftBack";
import { CloseFeedbackWindow } from "../../../assets/svg/CloseFeedbackWindow";
import { Button, Form, Input, Upload } from "antd";
import { PaperClip } from "../../../assets/svg/PaperClip";
import { Contacts } from "../contacts/Contacts";
import { RcFile } from "antd/es/upload";
import { FeedBackData, FeedBackDataWithoutImage, TypeFeedbackForm } from "../../../models/FeedBack";
import { usePostFeedBackMutation } from "../../../store/api/feedBack";
import { validateMessages } from "../../../utils/validateMessage";


export const FeedbackForm = ({closeWindow, setIsFirstWindow}: TypeFeedbackForm) => {
    const [file, setFile] = useState<RcFile>()
    const [sendFeedBackData,
        {
            isSuccess: isSuccessSendData,
            isError: isErrorSendData
        }] = usePostFeedBackMutation()
    const [form] = Form.useForm()


    function onSendData(values: FeedBackData) {
        const formDataFeedback = new FormData()
        if (values.image === undefined) {
            for (let key in values) {
                formDataFeedback.append(key, values[key as keyof FeedBackDataWithoutImage])
            }
        } else {
            for (let key in values) {
                formDataFeedback.append(key, values[key as keyof FeedBackData])
            }
        }
        sendFeedBackData(formDataFeedback)
    }

    useEffect(() => {
        if (isSuccessSendData) form.resetFields()
    }, [isSuccessSendData]);



    return (
        <div className={`flex flex-col items-center justify-center w-[324px] bg-white gap-3`}>
            <div className={`flex flex-col gap-2 w-full`}>
                <div className={`flex justify-between w-full items-center`}>
                    <Button className={`border-none flex items-center shadow-none p-0 h-max`}
                            onClick={() => {setIsFirstWindow(true)}}>
                        <LeftBack/>
                    </Button>
                    <span className={`text-[18px]/[25px] font-bold`}>
                        Письмо
                    </span>
                    <Button className={`border-none flex items-center shadow-none p-0 h-max`}
                            onClick={closeWindow}>
                        <CloseFeedbackWindow/>
                    </Button>
                </div>
                <span className={`text-[12px]/[16px] text-[#5F5F5F]`}>
                    Время ответа зависит от нагрузки на операторов, но обычно не превышает 1 рабочего дня
                </span>
            </div>

            <Form<FeedBackData>
                className={`flex flex-col gap-2 w-full`}
                onFinish={values => {onSendData(values)}}
                validateMessages={validateMessages}
                form={form}>
                <Form.Item className={`mb-0`}
                           name={'email'}
                           rules={[{
                               required: true,
                               type: 'email'
                           }]}>
                    <Input placeholder={'Email для ответа'} className={`shadow-[0_3px_5px_0px_#00000026] placeholder:text-[#808080]`}/>
                </Form.Item>
                <Form.Item className={`mb-0`} name={'message'}
                           rules={[{
                               required: true
                           }]}>
                    <Input.TextArea rows={4} placeholder={'Текст'} className={`shadow-[0_3px_5px_0px_#00000026] placeholder:text-[#808080]`}/>
                </Form.Item>

                <Form.Item className={`mb-0`} name={'image'}>
                    <div className={`flex w-full justify-between items-start`}>
                        <Upload
                            beforeUpload={(file, FileList) => {
                                setFile(file)
                                //проверку на размер файла можно сделать через file.size
                                return false
                            }}
                            className={'max-w-[200px]'}
                        >
                            <Button className={`bg-none shadow-none border-none gap-2 p-0 h-max flex items-center`}>
                                <PaperClip/>
                                <span className={`text-[12px]/[16px] text-[#808080]`}>
                                    Прикрепить файл
                                </span>
                            </Button>
                        </Upload>
                        <span className={`mt-[3px] text-[12px]/[16px] text-[#808080]`}>Максимум 8 МБ </span>
                    </div>
                </Form.Item>

                <div className={`flex flex-col gap-2`}>
                    <Button type={'primary'}
                            htmlType={'submit'}>
                        Отправить письмо
                    </Button>
                    {isSuccessSendData && <span className={'text-[green]'}>Письмо отправлено</span>}
                    {isErrorSendData && <span className={'text-[red]'}>Ошибка, письмо не отправлено</span>}
                    <span className={`text-center text-[12px]/[16px] text-[#808080]`}>
                        Отправляя письмо, вы соглашаетесь на обработку персональных данных
                    </span>
                </div>
                <Contacts/>
            </Form>

        </div>
    );
};

