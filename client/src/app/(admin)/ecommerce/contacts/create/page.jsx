import { Card, CardBody, Col, Row } from 'react-bootstrap'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import CreateContactForms from './components/CreateContactForms'
import PageMetaData from '@/components/PageTitle'

const CreateContact = () => {
  return (
    <>
      <PageBreadcrumb title="Create Contact" subName="Atrch" />
      <PageMetaData title="Create Contact" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <CreateContactForms />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default CreateContact
