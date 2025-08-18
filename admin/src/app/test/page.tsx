"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">CSS Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Test Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">This is a test card to verify CSS is working.</p>
              <div className="space-y-2">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="destructive">Destructive Button</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Colors Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-blue-500 rounded"></div>
                <div className="h-8 bg-green-500 rounded"></div>
                <div className="h-8 bg-red-500 rounded"></div>
                <div className="h-8 bg-yellow-500 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 