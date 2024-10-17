import { useGetPersonnelStagesQuery } from '../../../../store/api/serviceApi'
import React, { useState } from 'react'
import { Button, Spin } from 'antd'
import { RequisiteItem } from './RequisiteItem'
import { LoadingOutlined } from '@ant-design/icons'

export const RequisiteReview = () => {

	const { data: requisite_items = [], isLoading: loading } = useGetPersonnelStagesQuery();

	const verifyingItems = requisite_items.filter(item => item.status === 'VERIFYING');
	const refineItems = requisite_items.filter(item => item.status === 'REFINE');
	const completeItems = requisite_items.filter(item => item.status === 'COMPLETE');
	const allItems = [...verifyingItems, ...refineItems, ...completeItems]

	const [currentFilterItem, setCurrentFilterItem] = useState('ALL')
	const isActive = (filter: string) => currentFilterItem === filter;

	const ColumnFieldHeaderComponent = () => {
		return (
			<div className="flex flex-row mt-[40px]">
				<span className="ml-[1.5%] w-[30%] text-[14px] text-[#626364] font-normal">Соискатель</span>
				<span className="w-[20%] mr-[10%] text-[14px] text-[#626364] font-normal">Должность</span>
				<span className="w-[13.5%] text-[14px] text-[#626364] font-normal">Статус</span>
				<div className=" ml-[5%] w-[20%]"></div>
			</div>
		)
	}
	if (loading) {
		return (
			<>
				<div className="w-screen h-screen flex items-center">
					<div className="text-center ml-auto mt-[0%] mr-[50%]">
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
			<h1 className="text-[28px] font-normal text-[#000000]">Просмотр реквизитов</h1>
			<div className="flex flex-row gap-[12px] mt-[52px]">
				<Button
					id="buttonEmploymentStageAll"
					className={`px-[16px] py-[8px] font-normal rounded-[54.5px] text-[16px]/[16px] cursor-pointer ${
						isActive('ALL') ? 'bg-[#1F5CB8] text-white border-[1px] border-[1F5CB8]' : 'bg-[#F5F8FB] text-[#4A4B4C] border-[#4A4B4C] border-[1px]'
					}`}
					onClick={() => setCurrentFilterItem('ALL')}
				>
					все
				</Button>
				<Button
					id="buttonEmploymentStageOncheck"
					className={`px-[16px] py-[8px] font-normal rounded-[54.5px] text-[16px]/[16px] cursor-pointer ${
						isActive('VERIFYING') ? 'bg-[#1F5CB8] text-white border-[1px] border-[1F5CB8]' : 'bg-[#F5F8FB] text-[#4A4B4C] border-[#4A4B4C] border-[1px]'
					}`}
					onClick={() => setCurrentFilterItem('VERIFYING')}
				>
					на проверке
				</Button>
				<Button
					id="buttonEmploymentStageRevision"
					className={`px-[16px] py-[8px] font-normal rounded-[54.5px] text-[16px]/[16px] cursor-pointer ${
						isActive('REFINE') ? 'bg-[#1F5CB8] text-white border-[1px] border-[1F5CB8]' : 'bg-[#F5F8FB] text-[#4A4B4C] border-[#4A4B4C] border-[1px]'
					}`}
					onClick={() => setCurrentFilterItem('REFINE')}
				>
					доработка
				</Button>
				<Button
					id="buttonEmploymentStageAccepted"
					className={`px-[16px] py-[8px] font-normal rounded-[54.5px] text-[16px]/[16px] cursor-pointer ${
						isActive('COMPLETE') ? 'bg-[#1F5CB8] text-white border-[1px] border-[1F5CB8]' : 'bg-[#F5F8FB] text-[#4A4B4C] border-[#4A4B4C] border-[1px]'
					}`}
					onClick={() => setCurrentFilterItem('COMPLETE')}
				>
					принято
				</Button>
			</div>
			<ColumnFieldHeaderComponent></ColumnFieldHeaderComponent>
			<div className="flex flex-col mt-[16px] pb-[50px] gap-[12px]">
				{(currentFilterItem === 'ALL') && (
					<div className="flex flex-col gap-[12px]">
						{allItems.map(item => (
							<RequisiteItem {...item} key={item.respondId}></RequisiteItem>
							))}
					</div>
				)}
				{(currentFilterItem === 'VERIFYING') && (
					<div className="flex flex-col gap-[12px]">
						{verifyingItems.map(item => (
							<RequisiteItem {...item} key={item.respondId}></RequisiteItem>
						))}
					</div>
				)}
				{(currentFilterItem === 'REFINE') && (
					<div className="flex flex-col gap-[12px]">
						{refineItems.map(item => (
							<RequisiteItem {...item} key={item.respondId}></RequisiteItem>
						))}
					</div>
				)}
				{(currentFilterItem === 'COMPLETE') && (
					<div className="flex flex-col gap-[12px]">
						{completeItems.map(item => (
							<RequisiteItem {...item} key={item.respondId}></RequisiteItem>
						))}
					</div>
				)}
			</div>
		</div>
	)
}