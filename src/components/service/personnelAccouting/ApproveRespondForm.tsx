import { Button, Form, Modal, Select } from 'antd'
import { useState } from 'react'

import {
	useApproveReservedRespondMutation,
	useGetAllVacanciesQuery
} from '../../../store/api/serviceApi'

export const ApproveRespondForm = (props: {
	respondId: number
	vacancyId: number
	isRespondSentToSupervisor: boolean
	mode: 'RESUME' | 'RESPOND'
	callback: Function
}) => {
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
	// const [isRespondSentToSupervisor, setIsRespondSentToSupervisor] =
	// 	useState<boolean>(props.isRespondSentToSupervisor)
	const [approveRespond, result] = useApproveReservedRespondMutation()
	const { data: vacancies = [] } = useGetAllVacanciesQuery()

	return (
		<>
			<Modal
				centered
				open={isFormOpen}
				bodyStyle={{
					padding: '26px'
				}}
				className="pr-[52px] pl-[52px] pb-[52px]"
				footer={null}
				title={null}
				width={622}
				onCancel={() => {
					setIsFormOpen(false)
				}}
			>
				<Form
					requiredMark={false}
					layout="vertical"
					onFinish={values => {
						console.log(values.vacancy)
						approveRespond({
							respondId: props.respondId,
							vacancyId: values.vacancy
						})
							.unwrap()
							.then(() => {
								props.callback()
								setIsFormOpen(false)
							})
					}}
				>
					<p className="mb-[40px] font-content-font font-bold text-black text-[18px]/[21.6px]">
						Отправить руководителю
					</p>
					<Form.Item
						name={'vacancy'}
						rules={[{ required: true, message: 'Не выбрана вакансия' }]}
						label={
							<label className="text-black text-[18px]/[18px] font-content-font font-normal">
								Вакансия
							</label>
						}
					>
						<Select
							options={vacancies.map(vac => ({
								value: vac.id,
								label: vac.post
							}))}
							placeholder="Выбрать"
						></Select>
					</Form.Item>
					<Form.Item>
						<div style={{ textAlign: 'right', marginTop: 20 }}>
							<Button
								type="primary"
								htmlType="submit"
								className="rounded-[54.5px]"
							>
								Отправить
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Modal>
			<Button
				onClick={() => {
					props.mode === 'RESUME'
						? setIsFormOpen(true)
						: approveRespond({ respondId: props.respondId, vacancyId: 0 })
								.unwrap()
								.then(() => {
									props.callback()
								})
				}}
				type="primary"
				disabled={props.isRespondSentToSupervisor}
				className="font-content-font font-normal text-white text-[16px]/[16px] rounded-[54.5px] w-[224px] h-[40px] py-[8px] px-[24px]"
			>
				Отправить руководителю
			</Button>
		</>
	)
}
