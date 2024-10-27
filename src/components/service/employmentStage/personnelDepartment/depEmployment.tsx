import {DepEmploymentItem} from './depEmploymentItem'
import React, { useState } from 'react'
import { useGetPersonnelStagesQuery } from '../../../../store/api/serviceApi'
import { Button, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export const DepEmployment = () => {

	const { data: employment_stage_items = [], isLoading : loading }
		= useGetPersonnelStagesQuery();
	const verifyingItems = employment_stage_items.filter(item => item.status === 'VERIFYING');
	const refineItems = employment_stage_items.filter(item => item.status === 'REFINE');
	const completeItems = employment_stage_items.filter(item => item.status === 'ACCEPTED');
	const allItems = [...verifyingItems, ...refineItems, ...completeItems]

	const [currentFilterItem, setCurrentFilterItem] = useState('ALL')
	const isActive = (filter: string) => currentFilterItem === filter;

	const ColumnFieldHeaderComponent = () => {
		return (
			<div className="flex flex-row mt-[40px]">
				<span className="ml-[1.5%] w-[24%] text-[14px] text-[#626364] font-normal">Соискатель</span>
				<span className="w-[26%] text-[14px] text-[#626364] font-normal">Должность</span>
				<span className="w-[10%] text-[14px] text-[#626364] font-normal">Статус</span>
				<div className="w-[38.5%]"></div>
			</div>
		)
	}
	if (loading) {
		return (
			<>
				<div className="w-screen h-screen flex items-center">
					<div className="text-center ml-auto mr-[50%]">
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
		<div id="wrapper" className="flex flex-col bg-[#F5F8FB] px-[53px] pt-[120px] w-full">
			<h1 className="text-[28px] font-normal text-[#000000]">Этап трудоустройства</h1>
			<div className="flex flex-row gap-[12px] mt-[52px]">
				<Button
					id="buttonEmploymentStageAll"
					className={`px-[16px] py-[8px] font-normal rounded-[54.5px] text-[16px]/[16px] cursor-pointer ${
						isActive('ALL') ? 'bg-[#1F5CB8] text-white border-[1px] border-[#1F5CB8]' : 'bg-[#F5F8FB] text-[#4A4B4C] border-[#4A4B4C] border-[1px]'
					}`}
					onClick={() => {
						setCurrentFilterItem('ALL')
					}}
				>
					все
				</Button>
				<Button
					id="buttonEmploymentStageOncheck"
					className={`px-[16px] py-[8px] font-normal rounded-[54.5px] text-[16px]/[16px] cursor-pointer ${
						isActive('VERIFYING') ? 'bg-[#1F5CB8] text-white border-[1px] border-[#1F5CB8]' : 'bg-[#F5F8FB] text-[#4A4B4C] border-[#4A4B4C] border-[1px]'
					}`}
					onClick={() => {
						setCurrentFilterItem('VERIFYING')
					}}
				>
					на проверке
				</Button>
				<Button
					id="buttonEmploymentStageRevision"
					className={`px-[16px] py-[8px] font-normal rounded-[54.5px] text-[16px]/[16px] cursor-pointer ${
						isActive('REFINE') ? 'bg-[#1F5CB8] text-white border-[1px] border-[#1F5CB8]' : 'bg-[#F5F8FB] text-[#4A4B4C] border-[#4A4B4C] border-[1px]'
					}`}
					onClick={() => {
						setCurrentFilterItem('REFINE')
					}}
				>
					доработка
				</Button>
				<Button
					id="buttonEmploymentStageAccepted"
					className={`px-[16px] py-[8px] font-normal rounded-[54.5px] text-[16px]/[16px] cursor-pointer ${
						isActive('ACCEPTED') ? 'bg-[#1F5CB8] text-white border-[1px] border-[#1F5CB8]' : 'bg-[#F5F8FB] text-[#4A4B4C] border-[#4A4B4C] border-[1px]'
					}`}
					onClick={() => {
						setCurrentFilterItem('ACCEPTED')
					}}
				>
					принято
				</Button>
			</div>
			<ColumnFieldHeaderComponent></ColumnFieldHeaderComponent>
			<div className="flex flex-col mt-[16px] pb-[50px] gap-[12px]">
				{(currentFilterItem === 'ALL') && (
					<div className="flex flex-col gap-[12px]">
						{allItems.map(item => (
							<DepEmploymentItem {...item} key={item.respondId}></DepEmploymentItem>
							))}
					</div>
				)}
				{(currentFilterItem === 'VERIFYING') && (
					<div className="flex flex-col gap-[12px]">
						{verifyingItems.map(item => (
							<DepEmploymentItem {...item} key={item.respondId}></DepEmploymentItem>
						))}
					</div>
				)}
				{(currentFilterItem === 'REFINE') && (
					<div className="flex flex-col gap-[12px]">
						{refineItems.map(item => (
							<DepEmploymentItem {...item} key={item.respondId}></DepEmploymentItem>
						))}
					</div>
				)}
				{(currentFilterItem === 'ACCEPTED') && (
					<div className="flex flex-col gap-[12px]">
						{completeItems.map(item => (
							<DepEmploymentItem {...item} key={item.respondId}></DepEmploymentItem>
						))}
					</div>
				)}
			</div>
		</div>
	)
}