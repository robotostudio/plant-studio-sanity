import {useCallback, useState} from 'react'
import {Card, Flex, Grid, Label, Stack, Switch, Text, TextArea, TextInput} from '@sanity/ui'
import {set, unset, type ObjectInputProps} from 'sanity'

type Plan = {
  name?: string
  description?: string
  price?: string
  discount?: string
  period?: string
  features?: string[]
  highlighted?: boolean
}

/**
 * Custom input for one pricing plan: all of its fields on one compact card,
 * with the included features typed one per line.
 */
export function PlanInput(props: ObjectInputProps) {
  const {value, onChange, readOnly} = props
  const plan = (value ?? {}) as Plan

  // Keep the raw text so a new line can be typed before the next feature has words.
  const [featuresText, setFeaturesText] = useState((plan.features ?? []).join('\n'))

  const setField = useCallback(
    (field: keyof Plan, next: string | boolean | string[]) => {
      const empty = next === '' || (Array.isArray(next) && next.length === 0)
      onChange(empty ? unset([field]) : set(next, [field]))
    },
    [onChange],
  )

  return (
    <Card padding={4} radius={2} border tone={plan.highlighted ? 'primary' : 'default'}>
      <Stack space={4}>
        <Grid columns={[1, 1, 3]} gap={3}>
          <Stack space={2}>
            <Label size={1}>Plan name</Label>
            <TextInput
              value={plan.name ?? ''}
              readOnly={readOnly}
              onChange={(e) => setField('name', e.currentTarget.value)}
            />
          </Stack>
          <Stack space={2}>
            <Label size={1}>Price</Label>
            <TextInput
              value={plan.price ?? ''}
              readOnly={readOnly}
              onChange={(e) => setField('price', e.currentTarget.value)}
            />
          </Stack>
          <Stack space={2}>
            <Label size={1}>Billing period</Label>
            <TextInput
              value={plan.period ?? ''}
              readOnly={readOnly}
              onChange={(e) => setField('period', e.currentTarget.value)}
            />
          </Stack>
        </Grid>

        <Stack space={2}>
          <Label size={1}>Discount</Label>
          <Text size={1} muted>
            Optional, shown as a badge on the plan. For example: Save 20%
          </Text>
          <TextInput
            value={plan.discount ?? ''}
            readOnly={readOnly}
            onChange={(e) => setField('discount', e.currentTarget.value)}
          />
        </Stack>

        <Stack space={2}>
          <Label size={1}>Short description</Label>
          <TextInput
            value={plan.description ?? ''}
            readOnly={readOnly}
            onChange={(e) => setField('description', e.currentTarget.value)}
          />
        </Stack>

        <Stack space={2}>
          <Label size={1}>What is included</Label>
          <Text size={1} muted>
            Type one item per line.
          </Text>
          <TextArea
            rows={5}
            value={featuresText}
            readOnly={readOnly}
            onChange={(e) => {
              const text = e.currentTarget.value
              setFeaturesText(text)
              setField(
                'features',
                text
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean),
              )
            }}
          />
        </Stack>

        <Flex align="center" gap={3}>
          <Switch
            checked={Boolean(plan.highlighted)}
            readOnly={readOnly}
            onChange={(e) => onChange(set(e.currentTarget.checked, ['highlighted']))}
          />
          <Text size={1}>Highlight this plan as the recommended one</Text>
        </Flex>
      </Stack>
    </Card>
  )
}
