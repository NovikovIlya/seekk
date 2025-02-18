import { DeleteOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import { useDispatch } from 'react-redux'
import 'react-resizable/css/styles.css'

import { useAppSelector } from '../../store'
import { changeLayout, removeCard } from '../../store/reducers/LayoutsSlice'

import { jsxElements } from './defaultElement'
import { Apply } from '../apply/Apply'
import { AboutUniversityCard } from '../aboutUniversity/AboutUniversityCard'
import { Col, Row } from 'antd'


const DropDrag = () => {
	const dispatch = useDispatch()
	const layout = useAppSelector(state => state.Layout)
	const edit = useAppSelector(state => state.auth.edit)
	const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg')
	const [mounted, setMounted] = useState(false)
	const [toolbox, setToolbox] = useState<{ [index: string]: any[] }>({lg: []})
	const user = useAppSelector(state => state.auth.user)
	const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), []);

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		localStorage.setItem('dashboard', JSON.stringify(layout))
		return () => {}
	}, [layout])

	const [windowSize, setWindowSize] = useState(getWindowSize())

	useEffect(() => {
		function handleWindowResize() {
			setWindowSize(getWindowSize())
	}

		window.addEventListener('resize', handleWindowResize)

		return () => {
			window.removeEventListener('resize', handleWindowResize)
		}
	}, [])

	const onBreakpointChange = (breakpoint: any) => {
		setCurrentBreakpoint(breakpoint)
		setToolbox({
			...toolbox,
			[breakpoint]: toolbox[breakpoint] || toolbox[currentBreakpoint] || []
		})
	}

	const onLayoutChange = (layout: any, layouts: any) => {
		dispatch(changeLayout(layouts))
	}

	const onRemoveItem = (i: string) => {
		dispatch(removeCard(i))
	}

	const layoutValid = layout.lg.filter(obj1 =>jsxElements.some(obj2 => obj1.i === obj2.index))

	const generateDOM = layoutValid.map(item => {
		console.log('item',item)
		return (
			<div
				key={item.i}
				className="bg-white/70 backdrop-blur-sm rounded-[20px] shadow-md "
			>
				<div className="w-full h-full">
					{edit && item.i !== 'Schedule' && (
						<div
							className="absolute top-2 cursor-pointer right-2"
							onClick={() => onRemoveItem(item.i)}
						>
							<DeleteOutlined className=" mt-2 mr-2 opacity-50" />
						</div>
					)}
					{
						jsxElements
							.filter(el => el.index === item.i)[0].element
					}
				</div>
			</div>
		)
	})
	console.log('user',user)
	return (
		<div className=" mt-[40px] w-[min(1600px, 100%)] mb-[100px]">
			{user?.roles[0].type==='ABITUR' || user?.roles[0].type==='OTHER' ?
			<>
			<Apply/> 
			<Row>
				<Col span={8}>
					<AboutUniversityCard/>
				</Col>
			</Row>
			</>
			: 
			<ResponsiveReactGridLayout
				className="layout "
				cols={{ lg: 3, md: 2, sm: 2, xs: 2, xxs: 1 }}
				rowHeight={windowSize.innerWidth < 768 ? 210 : 320}
				containerPadding={[0, 0]}
				margin={[20, 20]}
				layouts={layout}
				measureBeforeMount={true}
				useCSSTransforms={mounted}
				onLayoutChange={onLayoutChange}
				onBreakpointChange={onBreakpointChange}
				isDraggable={edit}
				isResizable={false}
				compactType={null}
				preventCollision={true}
			>
				{generateDOM}
			</ResponsiveReactGridLayout>
			}

		</div>
	)
}

function getWindowSize() {
	const { innerWidth, innerHeight } = window
	return { innerWidth, innerHeight }
}

export default DropDrag
