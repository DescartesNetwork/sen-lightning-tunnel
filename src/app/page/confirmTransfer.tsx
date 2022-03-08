import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount, useWallet } from '@senhub/providers'
import { utils } from '@senswap/sen-js'
import moment from 'moment'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import PoweredBySentre from 'app/components/poweredBySentre'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import { MintSymbol } from 'shared/antd/mint'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { numeric } from 'shared/util'

const Content = ({
  label = '',
  value = '',
}: {
  label?: string
  value?: ReactNode
}) => {
  return (
    <Row>
      <Col flex="auto">
        <Typography.Text type="secondary">{label} </Typography.Text>
      </Col>
      <Col>{value}</Col>
    </Row>
  )
}

const ConfirmTransfer = () => {
  const [balance, setBalance] = useState(0)
  const {
    main: { mintSelected },
    setting: { decimal },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const { accounts } = useAccount()
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const getBalanceAccount = useCallback(async () => {
    const { splt } = window.sentre
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mintSelected,
    )
    const { amount } = accounts[accountAddress] || {}
    if (!amount) return setBalance(0)
    if (decimal) return setBalance(Number(amount))
    setBalance(Number(utils.undecimalize(amount, mintDecimals)))
  }, [accounts, decimal, mintDecimals, mintSelected, walletAddress])

  useEffect(() => {
    getBalanceAccount()
  }, [getBalanceAccount])

  return (
    <Card bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Confirm transfer</Typography.Title>
            </Col>
            <Col>
              <PoweredBySentre />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]} justify="center">
            <Col>
              <Space direction="vertical" size={12} align="center">
                <Typography.Text type="secondary">
                  Total transfer
                </Typography.Text>
                <Typography.Title level={2}>${0}</Typography.Title>
                <Tag
                  style={{
                    margin: 0,
                    borderRadius: 4,
                    color: 'rgb(249, 88, 96)',
                    background: 'rgba(249, 88, 96, 0.1)',
                    border: 'unset',
                  }}
                >
                  <MintSymbol mintAddress={mintSelected} />
                </Tag>
              </Space>
            </Col>
            <Col span={24}>
              <Card bordered={false} className="card-content">
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Content
                      label="Time"
                      value={moment(new Date()).format('DD MMM, YYYY HH:MM')}
                    />
                  </Col>
                  <Col span={24}>
                    <Content label="Quantity" value={0} />
                  </Col>
                  <Col span={24}>
                    <Content
                      label="Your balance"
                      value={
                        <Typography.Text>
                          {numeric(balance).format('0,0.00[0000]')}{' '}
                          <MintSymbol mintAddress={mintSelected} />
                        </Typography.Text>
                      }
                    />
                  </Col>
                  <Col span={24}>
                    <Content
                      label="Remaining"
                      value={
                        <Typography.Text>
                          {numeric(0).format('0,0.00[00]')}{' '}
                          <MintSymbol mintAddress={mintSelected} />
                        </Typography.Text>
                      }
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Button
                size="large"
                onClick={() => dispatch(onSelectStep(Step.one))}
                block
              >
                Back
              </Button>
            </Col>
            <Col span={12}>
              <Button size="large" disabled={false} type="primary" block>
                Confirm
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default ConfirmTransfer