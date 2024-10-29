import { LoadingOutlined } from '@ant-design/icons'
import { Radio, Spin } from 'antd'
import { useState } from 'react'

import { useGetReservedResponcesQuery } from '../../../store/api/serviceApi'
import { respondStatus } from '../../../store/reducers/type'

import { ReserveItem } from './ReserveItem'

export const Reserve = () => {
	const [type, setType] = useState('')

	const {
		data: reserve = [],
		refetch,
		isLoading: loading
	} = useGetReservedResponcesQuery(type)

	if (loading) {
		return (
			<>
				<div className="w-full h-full flex items-center">
					<div className="text-center ml-auto mr-auto">
						<Spin
							indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
						></Spin>
						<p className="font-content-font font-normal text-black text-[18px]/[18px]">
							Идёт загрузка...
						</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<div className="w-full pl-[52px] pr-[52px] pt-[60px] mt-[60px]">
				<h1 className="font-content-font font-normal text-black text-[28px]/[28px]">
					Резерв
				</h1>
				<Radio.Group
					className="mt-[52px] flex flex-wrap gap-[12px]"
					value={type}
					onChange={e => {
						setType(e.target.value)
					}}
				>
					<label
						className={`rounded-[54.5px] py-[8px] px-[16px] font-content-font ${
							type === ''
								? 'text-white bg-dasha-blue'
								: 'text-black border-solid border-black border-[1px]'
						} font-normal text-[16px]/[16px]`}
					>
						<Radio value={''} className="hidden"></Radio>
						все
					</label>
					<label
						className={`rounded-[54.5px] py-[8px] px-[16px] font-content-font ${
							type === 'RESUME'
								? 'text-white bg-dasha-blue'
								: 'text-black border-solid border-black border-[1px]'
						} font-normal text-[16px]/[16px]`}
					>
						<Radio value={'RESUME'} className="hidden"></Radio>
						резюме, отправленное напрямую
					</label>
					<label
						className={`rounded-[54.5px] py-[8px] px-[16px] font-content-font ${
							type === 'RESPOND'
								? 'text-white bg-dasha-blue'
								: 'text-black border-solid border-black border-[1px]'
						} font-normal text-[16px]/[16px]`}
					>
						<Radio value={'RESPOND'} className="hidden"></Radio>
						резюме, отправленное на вакансию
					</label>
				</Radio.Group>
				<div className="w-full flex mt-[52px] mb-[16px] pl-[20px] pr-[55px]">
					<h3 className="w-[30%] font-content-font text-black font-normal text-[14px]/[14px] opacity-[60%]">
						Должность
					</h3>
					<h3 className="ml-[5%] w-[20%] font-content-font text-black font-normal text-[14px]/[14px] opacity-[60%]">
						Соискатель
					</h3>
					<h3 className="ml-[5%] w-[8%] font-content-font text-black font-normal text-[14px]/[14px] opacity-[60%]">
						Дата отклика
					</h3>
				</div>
				{reserve.map(respond => (
					<ReserveItem
						id={respond.id}
						name={
							respond.userData?.lastname +
							' ' +
							respond.userData?.firstname +
							' ' +
							respond.userData?.middlename
						}
						respondDate={respond.respondDate}
						refetch={refetch}
						post={
							respond.oldVacancyName
								? respond.oldVacancyName
								: respond.desiredJob
						}
					/>
				))}
			</div>
		</>
	)
}
