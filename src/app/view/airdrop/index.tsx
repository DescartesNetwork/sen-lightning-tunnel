import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Row, Typography } from 'antd'
import { useAppRouter } from 'app/hooks/useAppRoute'
import { setTypeDistribute } from 'app/model/main.controller'
import { useDispatch } from 'react-redux'
import History from './history'

const Airdrop = () => {
  const { pushHistory } = useAppRouter()
  const dispatch = useDispatch()

  const addNewAirdrop = () => {
    pushHistory('/airdrop/add-new')
    return dispatch(setTypeDistribute('airdrop'))
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Title level={2}>Airdrop</Typography.Title>
          </Col>
          <Col>
            <Button
              icon={<IonIcon name="add-outline" />}
              type="primary"
              size="large"
              onClick={addNewAirdrop}
            >
              ADD NEW
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Typography.Title level={2}>Chart</Typography.Title>
      </Col>
      <Col span={24}>
        <History />
      </Col>
    </Row>
  )
}

export default Airdrop
