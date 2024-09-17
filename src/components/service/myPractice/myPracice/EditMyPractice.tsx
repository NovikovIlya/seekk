import {
	Button,
	Card,
	Col,
	Collapse,
	Descriptions,
	Form,
	List,
	Popover,
	Row,
	Space,
	Spin,
	Tabs,
	Tooltip} from 'antd'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ArrowLeftSvg } from '../../../../assets/svg'
import { validateMessages } from '../../../../utils/validateMessage'

import Diary from './Diary'
import Plan from './Plan'
import Final from './Final'
import { useGetOneMyPracticesQuery } from '../../../../store/api/practiceApi/mypractice'
import { LoadingOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

export const EditMyPractice = () => {
	const [form] = Form.useForm<any>()
	const path = useLocation()
	const id = path.pathname.split('/').at(-1)!
	const nav = useNavigate()
	const { Panel } = Collapse
	const [showFinal, setShowFinal] = useState(false)
	const [showFinalTwo, setShowFinalTwo] = useState(false)
	const {data:dataOne,isFetching,isSuccess} = useGetOneMyPracticesQuery(id)
	const formatedDate = ()=>{
		if(isSuccess){
			const [start, end] = dataOne?.practicePeriod?.split('-');
			const formattedStart = dayjs(start).format('DD.MM.YYYY');
			const formattedEnd = dayjs(end).format('DD.MM.YYYY');
			return [formattedStart,formattedEnd]
		}
		return []
	}

	const items: any = [
		{
			key: '1',
			label: 'Где будет проходить практика',
			children: dataOne?.place ? dataOne.place : 'Не указано'
		},
		{
			key: '2',
			label: 'Место прохождение практики',
			children: 'Казань'
		},
		{
			key: '3',
			label: 'Шифр',
			children:  dataOne?.specialty ? dataOne.specialty : 'Не указано'
		},
		{
			key: '4',
			label: 'Профиль',
			children:  dataOne?.profile ? dataOne.profile : 'Не указано'
		},
		{
			key: '5',
			label: 'Уровень образования',
			children: dataOne?.educationLevel ? dataOne.educationLevel : 'Не указано'
		},
		{
			key: '6',
			label: 'Курс',
			children:dataOne?.course ? dataOne.course : 'Не указано'
		},
		{
			key: '7',
			label: 'Группа',
			children: dataOne?.group ? dataOne.group : 'Не указано'
		},
		
		{
			key: '9',
			label: 'Тип практики',
			children: dataOne?.practiceType ? dataOne.practiceType : 'Не указано'
		},
		{
			key: '10',
			label: 'Вид практики',
			children: dataOne?.practiceKind ? dataOne.practiceKind : 'Не указано'
		},
		{
			key: '11',
			label: 'Период практики',
			children: dataOne?.practicePeriod ? `${formatedDate()[0]} - ${formatedDate()[1]}` : 'Не указано'
		},
		{
			key: '12',
			label: 'Учебный год',
			children:  dataOne?.academicYear ? dataOne.academicYear : 'Не указано'
		},
		{
			key: '13',
			label: 'ФИО руководителя практики',
			children:  dataOne?.departmentDirector ? dataOne.departmentDirector : 'Не указано'
		},
		{
			key: '14',
			label: 'ФИО руководителя от организации',
			children: dataOne?.departmentDirector ? dataOne.departmentDirector : 'Не указано'
		},
		{
			key: '15',
			label: 'Юридический адресс',
			children: dataOne?.departmentDirector ? dataOne.departmentDirector : 'Не указано'
		}
	]

	const onChange = (key: string) => {
		console.log(key)
	}

	

	return (
		<section className="container animate-fade-in">
			<Space size={10} align="center">
				<Button
					size="large"
					className="mt-1 mr-6 rounded-full border border-black"
					icon={<ArrowLeftSvg className="w-4 h-4 cursor-pointer mt-1" />}
					type="text"
					onClick={() => {
						nav('/services/mypractices/')
					}}
				/>
				<span className=" text-[28px] font-normal">Учебная практика по специальности "{dataOne?.specialty}" с {formatedDate()[0]} по {formatedDate()[1]} </span>
			</Space>

			<Tabs defaultActiveKey="1" onChange={onChange} className='mt-6'>
				<Tabs.TabPane tab={'Основная информация'} key={1}>
				{isFetching ? <Spin className="w-full mt-20 flex justify-start ml-10" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /> :
					<>
					<Row className='mb-4 mt-4'>
						<Col span={12} className="pr-[8px] ">
							<Card title="Оценка:" bordered={false} className='mb-4'>
									<Row>
										<Descriptions.Item className="" span={3} label={'1'} key={'1'}>
										<div className="">{dataOne?.grade ? dataOne.grade :'Нет оценки'}</div>
										</Descriptions.Item>
									</Row>
								</Card>
								<Card title="Основные сведения:" bordered={false}>
									<Row>
										<Descriptions  className="">
											{items.map((item: any) => (
												<Descriptions.Item className="" span={3} label={item.label} key={item.key}>
													<div className="">{item.children}</div>
												</Descriptions.Item>
											))}
										</Descriptions>
									</Row>
								</Card>
							
						</Col>
					</Row>
				
					<Form<any> validateMessages={validateMessages} form={form} layout={'vertical'} className='mb-8'>
						<Row gutter={[16, 16]} className={'mt-4'}>
							<Col xs={24} sm={24} md={18} lg={16} xl={12}>
								<List
									header={<div>Код и наименование компетенции:</div>}
									style={{
										overflow: 'auto',
										maxHeight: 300
									}}
									bordered
									// @ts-ignore
									dataSource={dataOne?.tasks}
									renderItem={(item: any, index: number) => (
										<List.Item
											style={{
												display: 'flex'
											}}
										>
											<div className="flex items-center">
												<div className=" p-3">{index + 1}</div>
												<div className="ml-2">{item.description}</div>
											</div>
										</List.Item>
									)}
								/>
							</Col>
						</Row>
					</Form>
					</>
					}
				</Tabs.TabPane>
				<Tabs.TabPane tab={'План и дневник практики'} key={2}>
					
					<Plan setShowFinal={setShowFinal} />

					<Diary setShowFinalTwo={setShowFinalTwo} />
				</Tabs.TabPane>
				{/* disabled={!showFinal || !showFinalTwo  } */}
			
					<Tabs.TabPane tab={<Popover  content={!showFinal || !showFinalTwo ? 'Раздел доступен только после' : null}>Отправка документов</Popover>} key={3} >
						<Row gutter={16} className="mt-14 mb-10">
							<Col span={12}>
								<Card title="Обратите внимание:" bordered={false}>
									<div className='mb-3'>Ваш пакет документов должен содержать:</div>
									<ul className="ml-6">
										<li>Отчет по практике</li>
										<li>Путевка практиканта</li>
										<li>Дневник практиканта</li>
									</ul>
								</Card>
							</Col>
							{/* <Col span={6}>
								<Card title="Обратите внимание" bordered={false}>
									Отчет должен заполняться самостоятельно.<br></br> В модуле “Практики студентов” формируется только
									титульный лист отчета.
								</Card>
							</Col> */}
						</Row>
					<Final/>
					</Tabs.TabPane>
				
			</Tabs>
		</section>
	)
}


