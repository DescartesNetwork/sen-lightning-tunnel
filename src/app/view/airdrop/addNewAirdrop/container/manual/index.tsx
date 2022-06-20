import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import Header from '../../../../../components/header'
import InputInfoTransfer from '../../../../../components/inputInfoTransfer'
import CardTotal from 'app/components/cardTotal'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { onSelectMethod } from 'app/model/main.controller'
import { Step } from 'app/constants'
import { removeRecipients } from 'app/model/recipients.controller'
import useTotal from 'app/hooks/useTotal'
import useValidateAmount from 'app/hooks/useValidateAmount'
import useRemainingBalance from 'app/hooks/useRemainingBalance'

const Manual = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    recipients: { recipients },
    main: { mintSelected, isTyping },
  } = useSelector((state: AppState) => state)
  const { quantity } = useTotal()
  const { amountError } = useValidateAmount()
  const remainingBalance = useRemainingBalance(mintSelected)

  const onBack = useCallback(async () => {
    await dispatch(onSelectMethod())
    await dispatch(removeRecipients())
    dispatch(onSelectStep(Step.one))
  }, [dispatch])

  const disabled =
    quantity <= 0 || amountError || remainingBalance < 0 || isTyping

  return (
    <Card className="card-lightning" bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header label="Fill in recipient information" />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col span={24}>Wallet address #{recipients.length + 1}</Col>
                {recipients &&
                  recipients.map(([walletAddress, amount], index) => (
                    <Col span={24} key={walletAddress + index}>
                      <InputInfoTransfer
                        amount={amount}
                        walletAddress={walletAddress}
                        index={index}
                      />
                    </Col>
                  ))}
                <Col span={24}>
                  <InputInfoTransfer />
                </Col>
              </Row>
            </Col>
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
                disabled={disabled}
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