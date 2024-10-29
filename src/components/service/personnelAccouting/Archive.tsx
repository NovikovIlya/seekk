import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

import { useGetArchivedResponcesQuery } from '../../../store/api/serviceApi'
import { RespondItem } from '../myResponds/RespondItem'

import { ArchiveItem } from './ArchiveItem'

export const Archive = () => {
	const {
		data: archive = [],
		refetch,
		isLoading: loading
	} = useGetArchivedResponcesQuery()

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
					Архив
				</h1>
				<div className="flex mt-[52px] mb-[16px] pl-[20px] pr-[55px]">
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
				{archive.map(respond => (
					<ArchiveItem
						id={respond.id}
						name={
							respond.userData?.lastname +
							' ' +
							respond.userData?.firstname +
							' ' +
							respond.userData?.middlename
						}
						respondDate={respond.responseDate}
						refetch={refetch}
						post={
							respond.vacancyName ? respond.vacancyName : respond.desiredJob
						}
					/>
				))}
			</div>
		</>
	)
}
