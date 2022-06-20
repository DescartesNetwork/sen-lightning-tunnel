import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BN from 'bn.js'

import { Button, Card, Col, Row, Space } from 'antd'
import Header from '../../../../../components/header'
import InputInfoTransfer from '../../../../../components/inputInfoTransfer2'
import CardTotal from 'app/components/cardTotal'
import DistributionTime from './distributionConfig/distributionConfigDetail'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { onSelectMethod } from 'app/model/main.controller'
import { Step } from 'app/constants'
import { removeRecipients } from 'app/model/recipients.controller'
import useTotal from 'app/hooks/useTotal'
import useValidateAmount from 'app/hooks/useValidateAmount'
import useRemainingBalance from 'app/hooks/useRemainingBalance'
import { RecipientInfo } from 'app/model/recipientsV2.controller'
import { utils } from '@senswap/sen-js'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import DistributionConfig from './distributionConfig'
import DistributionConfigDetail from './distributionConfig/distributionConfigDetail'

const Manual = () => {
  const {
    recipients2: { recipients },
    main: { mintSelected, isTyping },
  } = useSelector((state: AppState) => state)
  const { quantity } = useTotal()
  // const { amountError } = useValidateAmount()
  const remainingBalance = useRemainingBalance(mintSelected)
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const dispatch = useDispatch<AppDispatch>()

  const listRecipient = useMemo(() => {
    const nextRecipient: RecipientInfo[] = []
    for (const address in recipients) {
      const amountRecipient = recipients[address].length
      const amount = Number(recipients[address][0].amount) * amountRecipient

      const recipient: RecipientInfo = {
        address,
        amount: amount.toString(),
        unlockTime: 0,
      }
      nextRecipient.push(recipient)
    }
    return nextRecipient
  }, [recipients])

  const onBack = useCallback(async () => {
    await dispatch(onSelectMethod())
    await dispatch(removeRecipients())
    dispatch(onSelectStep(Step.one))
  }, [dispatch])

  // const disabled =
  //   quantity <= 0 || amountError || remainingBalance < 0 || isTyping

  return (
    <Card className="card-lightning" bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header label="Fill in recipient information" />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>Wallet address #{listRecipient.length + 1}</Col>
            <Col span={24}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <InputInfoTransfer />
                <DistributionConfig />
              </Space>
            </Col>
            {listRecipient &&
              listRecipient.map(({ address, amount }, index) => (
                <Col span={24} key={address + index}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <InputInfoTransfer
                      amount={amount}
                      walletAddress={address}
                      index={index}
                    />
                    <DistributionConfig walletAddress={address} />
                  </Space>
                </Col>
              ))}
            <Col span={24}>
              <CardTotal />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button onClick={onBack} size="large" type="ghost" block>
                Back
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                type="primary"
                onClick={() => dispatch(onSelectStep(Step.three))}
                block
                // disabled={disabled}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default Manual