import { Button, Checkbox, ConfigProvider, Modal } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from '../../../../store'
import { useSendEmploymentDocsMutation } from '../../../../store/api/serviceApi'

import { FileAttachment } from './FileAttachment'

export const EmplSend = (props: {
	respondId: number
	stageId: number
	stageName: string
}) => {
	const { empData } = useAppSelector(state => state.employmentData)
	const { docs } = useAppSelector(state => state.employmentSeekerDocs)

	const [sendDocs] = useSendEmploymentDocsMutation()
	const hasNotRequisites = empData.stages.find(
		stage => stage.type === 'SIXTH'
	)?.hasRequisites

	const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false)
	const [resultModalText, setResultModalText] = useState<string>('')

	const navigate = useNavigate()

	const [agree, setAgree] = useState<boolean>(false)

	return (
		<>
			<ConfigProvider
				theme={{
					token: {
						boxShadow: '0 0 19px 0 rgba(212, 227, 241, 0.6)'
					}
				}}
			>
				<Modal
					bodyStyle={{
						padding: '26px'
					}}
					width={407}
					className="pr-[52px] pl-[52px] pb-[52px]"
					open={isResultModalOpen}
					title={null}
					footer={null}
					centered
					onCancel={() => {
						setIsResultModalOpen(false)
					}}
				>
					<p className="text-center font-content-font text-black text-[16px]/[20px] font-normal">
						{resultModalText}
					</p>
					<Button
						className="rounded-[40px] w-full !py-[13px] mt-[40px]"
						type="primary"
						onClick={() => {
							setIsResultModalOpen(false)
							resultModalText ===
								'Документы успешно отправлены. Ожидайте проверки.' &&
								navigate('/services/myresponds/employment')
						}}
					>
						Ок
					</Button>
				</Modal>
			</ConfigProvider>
			<div className="flex flex-col gap-[40px] font-content-font font-normal text-black text-[16px]/[19.2px]">
				<p className="w-[60%]">
					Идейные соображения высшего порядка, а также консультация с широким
					активом играет важную роль в формировании позиций, занимаемых
					участниками в отношении поставленных задач. С другой стороны новая
					модель организационной деятельности способствует подготовки и
					реализации новых предложений. С другой стороны постоянное
					информационно-пропагандистское обеспечение нашей деятельности в
					значительной степени обуславливает создание направлений прогрессивного
					развития.
				</p>
				<ol className="flex flex-col gap-[40px] ml-[2%]">
					<li>С трудовыми условиями ознакомлен (а)</li>
					<li>Инструктаж пройден</li>
				</ol>
				<div className="bg-white rounded-[16px] shadow-custom-shadow p-[20px] w-[70%] flex flex-col gap-[20px]">
					<div className="grid gap-x-[36px] gap-y-[12px] grid-cols-[auto_10%_auto] items-center w-full">
						{docs.map(doc => (
							<FileAttachment
								{...doc}
								respondId={props.respondId}
								stageName={doc.employmentStageType}
								seventhStage
							/>
						))}
					</div>
				</div>
				{!hasNotRequisites && (
					<ol start={3} className="flex flex-col gap-[40px] ml-[2%]">
						<li>Необходимо завести банковскую карту</li>
					</ol>
				)}
				<Checkbox
					checked={agree}
					onChange={() => {
						setAgree(prev => !prev)
					}}
				>
					Подтверждаю достоверность документов
				</Checkbox>
				<Button
					disabled={!agree}
					type="primary"
					className="rounded-[54.5px] w-[282px]"
					onClick={() => {
						sendDocs({
							respondId: props.respondId,
							hasNotRequisites: !hasNotRequisites
						})
							.unwrap()
							.then(() => {
								setResultModalText(
									'Документы успешно отправлены. Ожидайте проверки.'
								)
								setIsResultModalOpen(true)
							})
							.catch(error => {
								try {
									setResultModalText(error.data.errors[0].message as string)
								} catch (err) {
									setResultModalText(
										'Что-то пошло не так, приносим извинения за неудобства'
									)
								}
								setIsResultModalOpen(true)
							})
					}}
				>
					Подтвердить и отправить данные
				</Button>
			</div>
		</>
	)
}
