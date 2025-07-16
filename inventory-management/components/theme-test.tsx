'use client'

import { useSystem } from '@/contexts/SystemContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ThemeTest() {
  const { config, setTheme, getCurrentTheme } = useSystem()
  const currentTheme = getCurrentTheme()

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Theme Test</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current: {currentTheme?.name || 'None'}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {config.theme.themes.map((theme) => (
          <Button
            key={theme.id}
            variant={theme.id === config.theme.current ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme(theme.id)}
            className="w-full"
          >
            {theme.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
