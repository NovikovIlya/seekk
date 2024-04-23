import {
	Button,
	Checkbox,
	Col,
	List,
	Radio,
	Row,
	Select,
	Space,
	Typography
} from 'antd'
import type { CheckboxProps, GetProp } from 'antd'
import { useEffect, useState } from 'react'

import { EditSvg } from '../../../../assets/svg/EditSvg'
import { PointsSvg } from '../../../../assets/svg/PointsSvg'

type CheckboxValueType = GetProp<typeof Checkbox.Group, 'value'>[number]

interface FilterType {
	value: string
	label: string
}

const filterSpecialization: FilterType[] = [
	{
		value: '',
		label: 'Все'
	},
	{
		value: '31.08.01 Акушерство и гинекология',
		label: '31.08.01 Акушерство и гинекология'
	},
	{
		value: '31.08.01 Педиатрия',
		label: '31.08.01 Педиатрия'
	}
]

const filterCourse: FilterType[] = [
	{
		value: '',
		label: 'Все'
	},
	{
		value: '1',
		label: '1'
	},
	{
		value: '2',
		label: '2'
	},
	{
		value: '3',
		label: '3'
	},
	{
		value: '4',
		label: '4'
	},
	{
		value: '5',
		label: '5'
	},
	{
		value: '6',
		label: '6'
	}
]

const filterType: FilterType[] = [
	{
		value: '',
		label: 'Все'
	},
	{
		value: 'Производственная',
		label: 'Производственная'
	},
	{
		value: 'Технологическая',
		label: 'Технологическая'
	}
]

const filterEducationLevel: FilterType[] = [
	{
		value: '',
		label: 'Все'
	},
	{
		value: 'Ординатура',
		label: 'Ординатура'
	},
	{
		value: 'Интернатура',
		label: 'Интернатура'
	}
]

const filterEducationForm: FilterType[] = [
	{
		value: '',
		label: 'Все'
	},
	{
		value: 'Очная',
		label: 'Очная'
	},
	{
		value: 'Заочная',
		label: 'Заочная'
	},
	{
		value: 'Очно - заочная',
		label: 'Очно - заочная'
	}
]

interface DataType {
	key: string
	specialization: string
	fillingDate: string
	type: string
	course: string
	academicYear: string
	group: string
	educationLevel: string
	educationForm: string
	sybtypePractice: string
	periodPractice: string
}

const data: DataType[] = [
	{
		key: '1',
		specialization: 'Лечебно-профилактическое учреждение по договору',
		fillingDate: '00.00.00, 00:00',
		type: 'Бессрочный',
		course: '1',
		academicYear: '2',
		group: '09-033',
		educationLevel: 'Ординатура',
		educationForm: 'Очная',
		sybtypePractice: 'Акушерство',
		periodPractice: '2020-2021'
	},
	{
		key: '2',
		specialization: 'Лечебно-профилактическое учреждение по договору',
		fillingDate: '00.00.00, 00:00',
		type: 'С пролонгацией',
		course: '2',
		academicYear: '2',
		group: '09-033',
		educationLevel: 'Ординатура',
		educationForm: 'Заочная',
		sybtypePractice: 'Акушерство',
		periodPractice: '2020-2021'
	}
]

const plainOptions = data.map(item => item.key)

type PropsType = {
	setIsCreate: (value: boolean) => void
	setIsPreview: (value: boolean) => void
	setIsFinalReview: (value: boolean) => void
}

export const PracticeSchedule = ({
	setIsCreate,
	setIsPreview,
	setIsFinalReview
}: PropsType) => {
	const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([])
	const checkAll = plainOptions.length === checkedList.length
	const indeterminate =
		checkedList.length > 0 && checkedList.length < plainOptions.length
	const [dataTable, setDataTable] = useState<DataType[]>(data)
	const [filters, setFilters] = useState<{
		type: string
		spec: string
		course: string
		level: string
		form: string
	}>({ type: '', spec: '', course: '', level: '', form: '' })

	useEffect(() => {
		setDataTable(
			data.filter(
				x =>
					x.type.includes(filters.type) &&
					x.specialization.includes(filters.spec) &&
					x.course.includes(filters.course) &&
					x.educationLevel.includes(filters.level) &&
					x.educationForm.includes(filters.form)
			)
		)
	}, [filters])

	const filter = (value: string, index: string) => {
		setFilters(prev => ({ ...prev, [index]: value }))
	}

	const onCheckboxClick: CheckboxProps['onChange'] = e => {
		const item = e.target.value
		setCheckedList(prev =>
			checkedList.includes(item)
				? prev.filter(x => x !== item)
				: [...prev, ...e.target.value]
		)
	}

	const onCheckAllClick: CheckboxProps['onChange'] = e => {
		setCheckedList(e.target.checked ? plainOptions : [])
	}

	return (
		<section className="container">
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Typography.Text className=" text-[28px] mb-14">
						График практик
					</Typography.Text>
				</Col>
			</Row>

			<Row className="mt-12">
				<Col span={2}>
					<Typography.Text>Наименование специальности</Typography.Text>
				</Col>
				<Col span={8}>
					<Select
						popupMatchSelectWidth={false}
						defaultValue=""
						className="w-full"
						options={filterSpecialization}
						onChange={value => filter(value, 'spec')}
					/>
				</Col>
				<Col span={8} offset={6}>
					<Space className="w-full flex-row-reverse">
						<Button
							type="primary"
							className="!rounded-full"
							onClick={() => setIsCreate(true)}
						>
							Создать график практик
						</Button>
					</Space>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className="mt-4">
				<Col span={1}>
					<Typography.Text className="whitespace-nowrap">Курс</Typography.Text>
				</Col>
				<Col span={1.5}>
					<Select
						popupMatchSelectWidth={false}
						defaultValue=""
						className="w-full"
						options={filterCourse}
						onChange={value => filter(value, 'course')}
					/>
				</Col>
				<Col span={2}>
					<Typography.Text>Вид практики</Typography.Text>
				</Col>
				<Col span={3}>
					<Select
						popupMatchSelectWidth={false}
						defaultValue=""
						className="w-full"
						options={filterType}
						onChange={value => filter(value, 'type')}
					/>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className="mt-4">
				<Col span={4}>
					<Typography.Text>Уровень образования</Typography.Text>
				</Col>
				<Col span={8}>
					<Select
						popupMatchSelectWidth={false}
						defaultValue=""
						className="w-full"
						options={filterEducationLevel}
						onChange={value => filter(value, 'level')}
					/>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className="mt-4">
				<Col span={4}>
					<Typography.Text>Форма обучения</Typography.Text>
				</Col>
				<Col span={8}>
					<Select
						popupMatchSelectWidth={false}
						defaultValue=""
						className="w-full"
						options={filterEducationForm}
						onChange={value => filter(value, 'form')}
					/>
				</Col>
			</Row>

			<Row className="mt-4">
				<Col span={12} flex="50%">
					<Radio.Group defaultValue="compressedView" buttonStyle="solid">
						<Radio.Button value="compressedView" className="rounded-l-full">
							Посмотреть в сжатом виде
						</Radio.Button>
						<Radio.Button value="tableView" className="rounded-r-full">
							Посмотреть данные в таблице
						</Radio.Button>
					</Radio.Group>
				</Col>
				<Col span={3} flex="50%">
					<Typography.Text>Сортировка</Typography.Text>
				</Col>
				<Col span={9}>
					<Select
						popupMatchSelectWidth={false}
						defaultValue="1"
						className="w-full"
						options={[{ value: '1', label: 'Все' }]}
					/>
				</Col>
			</Row>

			<Row className="mt-4">
				<Col flex={'auto'}>
					<List
						size="large"
						header={
							<div className="w-full justify-between flex items-center">
								<Checkbox
									indeterminate={indeterminate}
									onChange={onCheckAllClick}
									checked={checkAll}
								/>
								<Space size={40} className="max-w-xs min-w-[300px]">
									<Typography.Text>
										Шифр и наименование специальности
									</Typography.Text>
									<Button
										type="text"
										icon={<EditSvg />}
										className="opacity-0"
									/>
								</Space>
								<Typography.Text>Дата заполнения</Typography.Text>
								<Typography.Text>Вид практики</Typography.Text>
								<Typography.Text>Курс</Typography.Text>
								<Space size={40}>
									<Button type="text" icon={<PointsSvg />} />
								</Space>
							</div>
						}
						dataSource={dataTable}
						renderItem={item => (
							<List.Item className="bg-white mb-3">
								<Checkbox
									checked={checkedList.includes(item.key)}
									value={item.key}
									onChange={onCheckboxClick}
								/>
								<Space size={40} className="max-w-xs min-w-[300px]">
									<Typography.Text>{item.specialization}</Typography.Text>
									<Button
										type="text"
										icon={<EditSvg />}
										onClick={() => setIsCreate(true)}
									/>
								</Space>
								<Typography.Text>{item.fillingDate}</Typography.Text>
								<Typography.Text>{item.type}</Typography.Text>
								<Typography.Text>{item.course}</Typography.Text>
								<Space size={40}>
									<Button
										type="text"
										className="opacity-50"
										icon={<PointsSvg />}
									/>
								</Space>
							</List.Item>
						)}
					/>
				</Col>
			</Row>
		</section>
	)
}

export default PracticeSchedule