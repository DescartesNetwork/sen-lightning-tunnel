import { CSSProperties, Suspense } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Card, Col, Row, Spin, Typography } from 'antd'

import { numeric } from 'shared/util'

type HeroCardProps = {
  label: string
  icon: string
  value: string | number
  loading?: boolean
  cardStyles?: CSSProperties
}

const HeroCard = ({
  label,
  icon,
  value,
  loading = false,
  cardStyles = {},
}: HeroCardProps) => (
  <Suspense fallback={<>...Loading</>}>
    <Card
      bordered={false}
      className="card-lightning"
      bodyStyle={cardStyles}
      style={{ height: '100%' }}
    >
      <Row gutter={[12, 12]} align="middle">
        <Col flex="auto">
          <Typography.Text type="secondary">{label}</Typography.Text>
        </Col>
        <Col>
          <IonIcon className="card-hero-icon" name={icon} />
        </Col>
        <Col span={24}>
          <Typography.Title level={5}>
            ${numeric(value).format('0,0.[000]')}
          </Typography.Title>
        </Col>
      </Row>
    </Card>
  </Suspense>
)

export default HeroCard
